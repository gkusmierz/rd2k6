"""PostgreSQL persistence adapter for cart-based database.

Requires: pip install psycopg2-binary (or psycopg2)

This adapter mirrors SqlitePersistenceAdapter but targets PostgreSQL.
The schema SQL needs minor adaptation (AUTOINCREMENT → SERIAL, etc.)
"""

from __future__ import annotations

from typing import Optional

from ...domain.models import (
    Cart, Cut, Group, Log, LogLine, ElrLine, MigrationRecord, CuePoints
)
from ...ports.persistence_port import PersistencePort


class PostgresPersistenceAdapter(PersistencePort):
    """PostgreSQL adapter for staging/production cart-based persistence.

    Usage:
        adapter = PostgresPersistenceAdapter(
            host="localhost", port=5432, dbname="rivendell",
            user="rduser", password="secret"
        )
    """

    def __init__(self, host: str = "localhost", port: int = 5432,
                 dbname: str = "rivendell", user: str = "rduser",
                 password: str = ""):
        try:
            import psycopg2
            import psycopg2.extras
        except ImportError:
            raise ImportError(
                "psycopg2 is required for PostgreSQL support. "
                "Install with: pip install psycopg2-binary"
            )
        self._conn = psycopg2.connect(
            host=host, port=port, dbname=dbname,
            user=user, password=password
        )
        self._conn.autocommit = False
        self._cart_counters: dict[str, int] = {}

    def initialize_schema(self) -> None:
        from pathlib import Path
        schema_path = Path(__file__).parent.parent.parent.parent / "rivendell-schema.sql"
        schema_sql = schema_path.read_text()

        # Adapt SQLite-specific syntax for PostgreSQL
        pg_sql = schema_sql
        pg_sql = pg_sql.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "SERIAL PRIMARY KEY")
        pg_sql = pg_sql.replace("INSERT OR REPLACE", "INSERT")
        pg_sql = pg_sql.replace("INSERT OR IGNORE", "INSERT")
        pg_sql = pg_sql.replace("IF NOT EXISTS", "IF NOT EXISTS")

        cur = self._conn.cursor()
        for statement in pg_sql.split(";"):
            stmt = statement.strip()
            if stmt and not stmt.startswith("--"):
                try:
                    cur.execute(stmt)
                except Exception:
                    self._conn.rollback()
                    raise
        self._conn.commit()
        self._load_cart_counters()

    def _load_cart_counters(self) -> None:
        cur = self._conn.cursor()
        cur.execute("SELECT group_name, MAX(number) FROM cart GROUP BY group_name")
        for row in cur.fetchall():
            if row[1] is not None:
                self._cart_counters[row[0]] = row[1]

    def save_service(self, name: str, description: str = "") -> None:
        cur = self._conn.cursor()
        cur.execute("""
            INSERT INTO services (name, description) VALUES (%s, %s)
            ON CONFLICT (name) DO NOTHING
        """, (name, description))

    def save_group(self, group: Group) -> None:
        cur = self._conn.cursor()
        cur.execute("""
            INSERT INTO groups (name, description, default_cart_type,
                default_low_cart, default_high_cart, color)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (name) DO UPDATE SET
                description = EXCLUDED.description,
                default_low_cart = EXCLUDED.default_low_cart,
                default_high_cart = EXCLUDED.default_high_cart
        """, (
            group.name, group.description, int(group.default_cart_type),
            group.default_low_cart, group.default_high_cart, group.color
        ))

    def save_cart(self, cart: Cart) -> None:
        if cart.number == 0:
            cart.number = self.get_next_cart_number(cart.group_name)

        cur = self._conn.cursor()
        cur.execute("""
            INSERT INTO cart (number, type, group_name, title, artist, album,
                year, composer, publisher, song_id, bpm, average_length,
                cut_quantity, sched_codes, notes, metadata_datetime)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (number) DO UPDATE SET
                title = EXCLUDED.title, artist = EXCLUDED.artist,
                album = EXCLUDED.album, metadata_datetime = EXCLUDED.metadata_datetime
        """, (
            cart.number, int(cart.type), cart.group_name,
            cart.title, cart.artist, cart.album,
            cart.year, cart.composer, cart.publisher,
            cart.song_id, cart.bpm, cart.average_length,
            cart.cut_quantity, cart.sched_codes, cart.notes,
            cart.metadata_datetime,
        ))

        for i, cut in enumerate(cart.cuts):
            if not cut.cut_name:
                cut.cut_name = f"{cart.number:06d}_{i + 1:03d}"
            cut.cart_number = cart.number
            self._save_cut(cut)

    def _save_cut(self, cut: Cut) -> None:
        cp = cut.cue_points
        cur = self._conn.cursor()
        cur.execute("""
            INSERT INTO cuts (cut_name, cart_number, description, isrc, length,
                origin_datetime, origin_name, weight, play_counter,
                coding_format, sample_rate, bit_rate, channels, play_gain,
                start_point, end_point, fadeup_point, fadedown_point,
                segue_start_point, segue_end_point, segue_gain,
                hook_start_point, hook_end_point,
                talk_start_point, talk_end_point)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (cut_name) DO UPDATE SET
                length = EXCLUDED.length, play_gain = EXCLUDED.play_gain
        """, (
            cut.cut_name, cut.cart_number, cut.description, cut.isrc,
            cut.length, cut.origin_datetime, cut.origin_name,
            cut.weight, cut.play_counter, int(cut.coding_format),
            cut.sample_rate, cut.bit_rate, cut.channels, cut.play_gain,
            cp.start_point, cp.end_point, cp.fadeup_point, cp.fadedown_point,
            cp.segue_start_point, cp.segue_end_point, 0,
            cp.hook_start_point, cp.hook_end_point,
            cp.talk_start_point, cp.talk_end_point,
        ))

    def save_log(self, log: Log) -> None:
        cur = self._conn.cursor()
        cur.execute("""
            INSERT INTO logs (name, service, description, origin_user,
                origin_datetime, start_date, end_date, next_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (name) DO UPDATE SET
                description = EXCLUDED.description
        """, (
            log.name, log.service, log.description, log.origin_user,
            log.origin_datetime, log.start_date, log.end_date,
            len(log.lines),
        ))

        for line in log.lines:
            cur.execute("""
                INSERT INTO log_lines (log_name, line_id, count, cart_number,
                    start_time, time_type, trans_type, type, comment, label)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                log.name, line.line_id, line.count, line.cart_number,
                line.start_time, int(line.time_type), int(line.trans_type),
                int(line.type), line.comment, line.label,
            ))

    def save_elr_line(self, line: ElrLine) -> None:
        cur = self._conn.cursor()
        cur.execute("""
            INSERT INTO elr_lines (service_name, log_name, cart_number,
                cut_number, title, artist, start_datetime, length, station_name)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            line.service_name, line.log_name, line.cart_number,
            line.cut_number, line.title, line.artist,
            line.start_datetime, line.length, line.station_name,
        ))

    def save_migration_record(self, record: MigrationRecord) -> None:
        cur = self._conn.cursor()
        cur.execute("""
            INSERT INTO migration_map (source_system, source_id,
                source_external_id, target_cart_number, target_cut_name,
                status, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (source_system, source_id) DO UPDATE SET
                target_cart_number = EXCLUDED.target_cart_number,
                target_cut_name = EXCLUDED.target_cut_name,
                status = EXCLUDED.status
        """, (
            record.source_system, record.source_id,
            record.source_external_id, record.target_cart_number,
            record.target_cut_name, record.status, record.notes,
        ))

    def get_migration_record(
        self, source_system: str, source_id: str
    ) -> Optional[MigrationRecord]:
        cur = self._conn.cursor()
        cur.execute("""
            SELECT source_system, source_id, source_external_id,
                target_cart_number, target_cut_name, status, notes
            FROM migration_map WHERE source_system = %s AND source_id = %s
        """, (source_system, source_id))
        row = cur.fetchone()
        if not row:
            return None
        return MigrationRecord(
            source_system=row[0], source_id=row[1],
            source_external_id=row[2] or "",
            target_cart_number=row[3],
            target_cut_name=row[4] or "",
            status=row[5] or "pending",
            notes=row[6] or "",
        )

    def get_next_cart_number(self, group_name: str) -> int:
        cur = self._conn.cursor()
        cur.execute(
            "SELECT default_low_cart, default_high_cart FROM groups WHERE name = %s",
            (group_name,)
        )
        row = cur.fetchone()
        if not row:
            raise ValueError(f"Unknown group: {group_name}")

        low, high = row
        current = self._cart_counters.get(group_name, low - 1)
        next_num = current + 1
        if next_num > high:
            raise OverflowError(f"Cart range exhausted for group {group_name}")
        self._cart_counters[group_name] = next_num
        return next_num

    def get_cart(self, number: int) -> Optional[Cart]:
        cur = self._conn.cursor()
        cur.execute("SELECT * FROM cart WHERE number = %s", (number,))
        row = cur.fetchone()
        if not row:
            return None
        # Simplified — full implementation would map all columns
        return Cart(number=row[0], title=row[3] or "", artist=row[4] or "")

    def get_cart_by_song_id(self, song_id: str) -> Optional[Cart]:
        cur = self._conn.cursor()
        cur.execute("SELECT * FROM cart WHERE song_id = %s", (song_id,))
        row = cur.fetchone()
        if not row:
            return None
        return Cart(number=row[0], title=row[3] or "", artist=row[4] or "")

    def commit(self) -> None:
        self._conn.commit()

    def rollback(self) -> None:
        self._conn.rollback()

    def close(self) -> None:
        self._conn.close()
