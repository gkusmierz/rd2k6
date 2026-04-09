"""SQLite persistence adapter for cart-based database."""

from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Optional

from ...domain.models import (
    Cart, Cut, Group, Log, LogLine, ElrLine, MigrationRecord, CuePoints
)
from ...ports.persistence_port import PersistencePort

SCHEMA_PATH = Path(__file__).parent.parent.parent.parent / "rivendell-schema.sql"


class SqlitePersistenceAdapter(PersistencePort):
    """SQLite adapter for local testing of cart-based persistence."""

    def __init__(self, db_path: str = ":memory:"):
        self._conn = sqlite3.connect(db_path)
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA foreign_keys=ON")
        self._cart_counters: dict[str, int] = {}

    def initialize_schema(self) -> None:
        schema_sql = SCHEMA_PATH.read_text()
        self._conn.executescript(schema_sql)
        self._conn.commit()
        self._load_cart_counters()

    def _load_cart_counters(self) -> None:
        """Load current max cart numbers per group."""
        for row in self._conn.execute(
            "SELECT group_name, MAX(number) as max_num FROM cart GROUP BY group_name"
        ):
            self._cart_counters[row["group_name"]] = row["max_num"]

    def save_service(self, name: str, description: str = "") -> None:
        self._conn.execute(
            "INSERT OR IGNORE INTO services (name, description) VALUES (?, ?)",
            (name, description)
        )

    def save_group(self, group: Group) -> None:
        self._conn.execute("""
            INSERT OR REPLACE INTO groups
            (name, description, default_cart_type, default_low_cart, default_high_cart, color)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            group.name, group.description, int(group.default_cart_type),
            group.default_low_cart, group.default_high_cart, group.color
        ))

    def save_cart(self, cart: Cart) -> None:
        # Assign cart number if not set
        if cart.number == 0:
            cart.number = self.get_next_cart_number(cart.group_name)

        self._conn.execute("""
            INSERT OR REPLACE INTO cart
            (number, type, group_name, title, artist, album, year,
             composer, publisher, song_id, bpm, average_length,
             cut_quantity, sched_codes, notes, metadata_datetime)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cart.number, int(cart.type), cart.group_name,
            cart.title, cart.artist, cart.album,
            cart.year.isoformat() if cart.year else None,
            cart.composer, cart.publisher, cart.song_id,
            cart.bpm, cart.average_length, cart.cut_quantity,
            cart.sched_codes, cart.notes,
            cart.metadata_datetime.isoformat() if cart.metadata_datetime else None,
        ))

        for i, cut in enumerate(cart.cuts):
            if not cut.cut_name:
                cut.cut_name = f"{cart.number:06d}_{i + 1:03d}"
            cut.cart_number = cart.number
            self._save_cut(cut)

    def _save_cut(self, cut: Cut) -> None:
        cp = cut.cue_points
        self._conn.execute("""
            INSERT OR REPLACE INTO cuts
            (cut_name, cart_number, description, isrc, length,
             origin_datetime, origin_name, weight, play_counter,
             coding_format, sample_rate, bit_rate, channels, play_gain,
             start_point, end_point, fadeup_point, fadedown_point,
             segue_start_point, segue_end_point, segue_gain,
             hook_start_point, hook_end_point,
             talk_start_point, talk_end_point)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cut.cut_name, cut.cart_number, cut.description, cut.isrc,
            cut.length,
            cut.origin_datetime.isoformat() if cut.origin_datetime else None,
            cut.origin_name, cut.weight, cut.play_counter,
            int(cut.coding_format), cut.sample_rate, cut.bit_rate,
            cut.channels, cut.play_gain,
            cp.start_point, cp.end_point, cp.fadeup_point, cp.fadedown_point,
            cp.segue_start_point, cp.segue_end_point, 0,
            cp.hook_start_point, cp.hook_end_point,
            cp.talk_start_point, cp.talk_end_point,
        ))

    def save_log(self, log: Log) -> None:
        self._conn.execute("""
            INSERT OR REPLACE INTO logs
            (name, service, description, origin_user, origin_datetime,
             start_date, end_date, next_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            log.name, log.service, log.description, log.origin_user,
            log.origin_datetime.isoformat() if log.origin_datetime else None,
            log.start_date.isoformat() if log.start_date else None,
            log.end_date.isoformat() if log.end_date else None,
            len(log.lines),
        ))

        for line in log.lines:
            self._conn.execute("""
                INSERT INTO log_lines
                (log_name, line_id, count, cart_number, start_time,
                 time_type, trans_type, type, comment, label)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                log.name, line.line_id, line.count, line.cart_number,
                line.start_time, int(line.time_type), int(line.trans_type),
                int(line.type), line.comment, line.label,
            ))

    def save_elr_line(self, line: ElrLine) -> None:
        self._conn.execute("""
            INSERT INTO elr_lines
            (service_name, log_name, cart_number, cut_number,
             title, artist, start_datetime, length, station_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            line.service_name, line.log_name, line.cart_number,
            line.cut_number, line.title, line.artist,
            line.start_datetime.isoformat() if line.start_datetime else None,
            line.length, line.station_name,
        ))

    def save_migration_record(self, record: MigrationRecord) -> None:
        self._conn.execute("""
            INSERT OR REPLACE INTO migration_map
            (source_system, source_id, source_external_id,
             target_cart_number, target_cut_name, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            record.source_system, record.source_id,
            record.source_external_id, record.target_cart_number,
            record.target_cut_name, record.status, record.notes,
        ))

    def get_migration_record(
        self, source_system: str, source_id: str
    ) -> Optional[MigrationRecord]:
        row = self._conn.execute("""
            SELECT * FROM migration_map
            WHERE source_system = ? AND source_id = ?
        """, (source_system, source_id)).fetchone()

        if not row:
            return None
        return MigrationRecord(
            source_system=row["source_system"],
            source_id=row["source_id"],
            source_external_id=row["source_external_id"] or "",
            target_cart_number=row["target_cart_number"],
            target_cut_name=row["target_cut_name"] or "",
            status=row["status"] or "pending",
            notes=row["notes"] or "",
        )

    def get_next_cart_number(self, group_name: str) -> int:
        # Look up group range
        row = self._conn.execute(
            "SELECT default_low_cart, default_high_cart FROM groups WHERE name = ?",
            (group_name,)
        ).fetchone()

        if not row:
            raise ValueError(f"Unknown group: {group_name}")

        low = row["default_low_cart"]
        current = self._cart_counters.get(group_name, low - 1)
        next_num = current + 1

        if next_num > row["default_high_cart"]:
            raise OverflowError(
                f"Cart range exhausted for group {group_name} "
                f"(max: {row['default_high_cart']})"
            )

        self._cart_counters[group_name] = next_num
        return next_num

    def get_cart(self, number: int) -> Optional[Cart]:
        row = self._conn.execute(
            "SELECT * FROM cart WHERE number = ?", (number,)
        ).fetchone()
        if not row:
            return None
        return self._row_to_cart(row)

    def get_cart_by_song_id(self, song_id: str) -> Optional[Cart]:
        row = self._conn.execute(
            "SELECT * FROM cart WHERE song_id = ?", (song_id,)
        ).fetchone()
        if not row:
            return None
        return self._row_to_cart(row)

    def _row_to_cart(self, row) -> Cart:
        cart = Cart(
            number=row["number"],
            group_name=row["group_name"] or "",
            title=row["title"] or "",
            artist=row["artist"] or "",
            album=row["album"] or "",
            song_id=row["song_id"] or "",
            bpm=row["bpm"] or 0,
            average_length=row["average_length"] or 0,
            cut_quantity=row["cut_quantity"] or 0,
        )

        # Load cuts
        for cut_row in self._conn.execute(
            "SELECT * FROM cuts WHERE cart_number = ?", (cart.number,)
        ):
            cut = Cut(
                cut_name=cut_row["cut_name"],
                cart_number=cut_row["cart_number"],
                description=cut_row["description"] or "",
                isrc=cut_row["isrc"] or "",
                length=cut_row["length"] or 0,
                coding_format=cut_row["coding_format"] or 0,
                play_gain=cut_row["play_gain"] or 0,
                cue_points=CuePoints(
                    start_point=cut_row["start_point"],
                    end_point=cut_row["end_point"],
                    fadeup_point=cut_row["fadeup_point"],
                    fadedown_point=cut_row["fadedown_point"],
                    segue_start_point=cut_row["segue_start_point"],
                    segue_end_point=cut_row["segue_end_point"],
                    hook_start_point=cut_row["hook_start_point"],
                    hook_end_point=cut_row["hook_end_point"],
                    talk_start_point=cut_row["talk_start_point"],
                    talk_end_point=cut_row["talk_end_point"],
                ),
            )
            cart.cuts.append(cut)

        return cart

    def commit(self) -> None:
        self._conn.commit()

    def rollback(self) -> None:
        self._conn.rollback()

    def close(self) -> None:
        self._conn.close()

    # Convenience query methods for verification
    def count_carts(self, group_name: Optional[str] = None) -> int:
        if group_name:
            row = self._conn.execute(
                "SELECT COUNT(*) FROM cart WHERE group_name = ?", (group_name,)
            ).fetchone()
        else:
            row = self._conn.execute("SELECT COUNT(*) FROM cart").fetchone()
        return row[0]

    def count_cuts(self) -> int:
        return self._conn.execute("SELECT COUNT(*) FROM cuts").fetchone()[0]

    def count_logs(self) -> int:
        return self._conn.execute("SELECT COUNT(*) FROM logs").fetchone()[0]

    def count_log_lines(self) -> int:
        return self._conn.execute("SELECT COUNT(*) FROM log_lines").fetchone()[0]
