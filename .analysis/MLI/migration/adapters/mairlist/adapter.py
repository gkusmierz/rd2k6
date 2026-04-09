"""MairList SQLite source data adapter."""

from __future__ import annotations

import sqlite3
import xml.etree.ElementTree as ET
from datetime import datetime, date
from typing import Iterator, Optional

from ...domain.models import (
    Cart, CartType, Cut, CodingFormat, CuePoints, Group, Log, LogLine,
    LogLineType, TimeType, TransType, ElrLine, VoiceTrack
)
from ...ports.source_port import SourceDataPort

# MairList type → Rivendell group mapping
TYPE_TO_GROUP = {
    "Music": "MUSIC",
    "Instrumental": "INSTRU",
    "Jingle": "JINGLE",
    "Drop": "DROP",
    "Weather": "WEATHER",
    "News": "NEWS",
    "Voice": "VOICE",
}

# MairList cue marker → CuePoints field mapping
MARKER_MAP = {
    "CueIn": "start_point",
    "CueOut": "end_point",
    "FadeIn": "fadeup_point",
    "FadeOut": "fadedown_point",
    "StartNext": "segue_start_point",
    "HookIn": "hook_start_point",
    "HookOut": "hook_end_point",
    "Ramp1": "talk_start_point",
    "Ramp2": "talk_end_point",
}

GROUP_DEFS = {
    "MUSIC":   Group("MUSIC",   "Music",         default_low_cart=10000, default_high_cart=19999),
    "INSTRU":  Group("INSTRU",  "Instrumental",  default_low_cart=20000, default_high_cart=29999),
    "JINGLE":  Group("JINGLE",  "Jingles",       default_low_cart=30000, default_high_cart=39999),
    "DROP":    Group("DROP",    "Drops",          default_low_cart=40000, default_high_cart=49999),
    "WEATHER": Group("WEATHER", "Weather",        default_low_cart=50000, default_high_cart=59999),
    "NEWS":    Group("NEWS",    "News",           default_low_cart=60000, default_high_cart=69999),
    "VOICE":   Group("VOICE",   "Voice Tracks",   default_low_cart=70000, default_high_cart=79999),
    "BED":     Group("BED",     "Beds",           default_low_cart=80000, default_high_cart=89999),
    "DRONE":   Group("DRONE",   "Drones",         default_low_cart=90000, default_high_cart=99999),
}

# Storage-based group override (when type alone isn't enough)
STORAGE_TO_GROUP = {
    3: "BED",    # bed storage
    5: "DRONE",  # drn storage
    6: "VOICE",  # vtx storage
}


def _parse_datetime(s: Optional[str]) -> Optional[datetime]:
    if not s:
        return None
    for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None


def _file_to_coding_format(filename: Optional[str]) -> CodingFormat:
    if not filename:
        return CodingFormat.PCM_WAV
    lower = filename.lower()
    if lower.endswith(".flac"):
        return CodingFormat.FLAC
    if lower.endswith(".mp3"):
        return CodingFormat.MPEG_L3
    if lower.endswith(".ogg"):
        return CodingFormat.OGG
    return CodingFormat.PCM_WAV


def _sec_to_ms(val: Optional[float]) -> int:
    """Convert seconds (float) to milliseconds (int), or -1 if None."""
    if val is None or val < 0:
        return -1
    return round(val * 1000)


class MairListAdapter(SourceDataPort):
    """Read-only adapter for MairList SQLite databases."""

    def __init__(self, db_path: str, storage_base_paths: Optional[dict[int, str]] = None):
        """
        Args:
            db_path: Path to MairList .mldb SQLite file
            storage_base_paths: Mapping of storage_id → filesystem base path
                e.g. {1: '/data/929-sync.../mus', 2: '/data/929-sync.../jin', ...}
        """
        self._conn = sqlite3.connect(db_path)
        self._conn.row_factory = sqlite3.Row
        self._storage_paths = storage_base_paths or {}

    def get_groups(self) -> list[Group]:
        return list(GROUP_DEFS.values())

    def _resolve_group(self, item_type: Optional[str], storage_id: Optional[int]) -> str:
        if storage_id and storage_id in STORAGE_TO_GROUP:
            return STORAGE_TO_GROUP[storage_id]
        return TYPE_TO_GROUP.get(item_type or "", "MUSIC")

    def _load_cue_points(self, item_id: int) -> CuePoints:
        cur = self._conn.execute(
            "SELECT type, value FROM item_cuemarkers WHERE item = ?", (item_id,)
        )
        cp = CuePoints()
        for row in cur:
            field_name = MARKER_MAP.get(row["type"])
            if field_name:
                setattr(cp, field_name, _sec_to_ms(row["value"]))
        return cp

    def _load_attributes(self, item_id: int) -> dict[str, str]:
        cur = self._conn.execute(
            "SELECT name, value FROM item_attributes WHERE item = ?", (item_id,)
        )
        return {row["name"]: row["value"] for row in cur if row["value"]}

    def get_items(self, group: Optional[str] = None) -> Iterator[Cart]:
        query = "SELECT * FROM items ORDER BY idx"
        for row in self._conn.execute(query):
            item_group = self._resolve_group(row["type"], row["storage"])
            if group and item_group != group:
                continue

            attrs = self._load_attributes(row["idx"])
            cue_points = self._load_cue_points(row["idx"])

            duration_ms = _sec_to_ms(row["duration"]) if row["duration"] else 0

            # Parse year
            year_val = attrs.get("Year")
            cart_year = None
            if year_val:
                try:
                    cart_year = date(int(year_val[:4]), 1, 1)
                except (ValueError, TypeError):
                    pass

            # Build Cut
            cut = Cut(
                cut_name="",  # assigned during persistence
                cart_number=0,  # assigned during persistence
                description=(row["title"] or "")[:64],
                isrc=attrs.get("ISRC", "")[:12],
                length=duration_ms if duration_ms > 0 else 0,
                origin_datetime=_parse_datetime(row["created"]),
                origin_name="MairList Import",
                coding_format=_file_to_coding_format(row["filename"]),
                play_gain=round((row["amplification"] or 0) * 100),
                cue_points=cue_points,
                source_file_path=self._resolve_file_path(row["storage"], row["filename"]),
            )

            # If segue end not set but segue start is, default to cut end
            if cut.cue_points.segue_start_point > -1 and cut.cue_points.segue_end_point == -1:
                cut.cue_points.segue_end_point = cut.length

            cart = Cart(
                number=0,  # assigned during persistence
                group_name=item_group,
                title=row["title"] or "",
                artist=row["artist"] or "",
                album=attrs.get("Album", ""),
                year=cart_year,
                composer=attrs.get("COMPOSER", ""),
                publisher=attrs.get("PUBLISHER", ""),
                song_id=(row["externalid"] or "")[:32],
                bpm=round(float(attrs.get("BPM", "0") or "0")),
                average_length=cut.length,
                notes=row["comment"] or "",
                metadata_datetime=_parse_datetime(row["updated"]),
                cuts=[cut],
                _source_idx=row["idx"],
            )
            yield cart

    def get_item_count(self, group: Optional[str] = None) -> int:
        if group is None:
            row = self._conn.execute("SELECT COUNT(*) FROM items").fetchone()
            return row[0]
        count = 0
        for row in self._conn.execute("SELECT type, storage FROM items"):
            if self._resolve_group(row["type"], row["storage"]) == group:
                count += 1
        return count

    def get_logs(self) -> Iterator[Log]:
        # Group playlist entries by slot (date+hour)
        cur = self._conn.execute("""
            SELECT DISTINCT station, subplaylist, slot
            FROM playlist
            ORDER BY slot
        """)
        slots = cur.fetchall()

        for slot_row in slots:
            station = slot_row["station"]
            subplaylist = slot_row["subplaylist"]
            slot = slot_row["slot"]

            # Parse slot datetime
            slot_dt = _parse_datetime(slot)
            if not slot_dt:
                continue

            log_name = slot_dt.strftime("%Y-%m-%d-%H")
            if subplaylist > 0:
                log_name += f"-sub{subplaylist}"

            log = Log(
                name=log_name,
                service="929FM",
                description=f"MairList import {slot}",
                origin_user="mairlist-import",
                origin_datetime=datetime.now(),
                start_date=slot_dt.date(),
            )

            # Load lines for this slot
            lines_cur = self._conn.execute("""
                SELECT pos, item, duration, xmldata, timing, fixtime, state
                FROM playlist
                WHERE station = ? AND subplaylist = ? AND slot = ?
                ORDER BY pos
            """, (station, subplaylist, slot))

            for i, prow in enumerate(lines_cur):
                line = LogLine(
                    line_id=i,
                    count=i,
                    cart_number=prow["item"] or 0,  # needs remapping later
                    type=LogLineType.CART,
                    trans_type=TransType.SEGUE if i > 0 else TransType.PLAY,
                )

                # Parse timing from fixtime or xmldata
                if prow["fixtime"]:
                    line.time_type = TimeType.HARD
                    try:
                        parts = prow["fixtime"].split(":")
                        line.start_time = (
                            int(parts[0]) * 3600000
                            + int(parts[1]) * 60000
                            + int(parts[2]) * 1000
                        )
                    except (ValueError, IndexError):
                        pass

                # Check if this is a voicetrack entry (from xmldata)
                xmldata = prow["xmldata"]
                if xmldata and "<Type>Voice</Type>" in xmldata:
                    line.type = LogLineType.TRACK

                log.lines.append(line)

            yield log

    def get_voicetracks(self) -> Iterator[VoiceTrack]:
        cur = self._conn.execute("""
            SELECT station, slot, pos, xmldata
            FROM playlist
            WHERE xmldata LIKE '%<Type>Voice</Type>%'
            ORDER BY slot, pos
        """)

        for row in cur:
            xmldata = row["xmldata"]
            if not xmldata:
                continue

            try:
                root = ET.fromstring(xmldata)
            except ET.ParseError:
                continue

            filename_el = root.find("Filename")
            title_el = root.find("Title")
            duration_el = root.find("Duration")
            markers = root.find("Markers")

            filename = ""
            if filename_el is not None and filename_el.text:
                # Extract just the filename from Windows path
                path = filename_el.text.replace("\\", "/")
                filename = path.split("/")[-1]

            start_next = -1.0
            if markers is not None:
                for marker in markers.findall("Marker"):
                    if marker.get("Type") == "StartNext":
                        try:
                            start_next = float(marker.get("Position", "-1"))
                        except ValueError:
                            pass

            vt = VoiceTrack(
                filename=filename,
                title=title_el.text if title_el is not None else "",
                duration=float(duration_el.text) if duration_el is not None and duration_el.text else 0.0,
                start_next=start_next,
                playlist_slot=_parse_datetime(row["slot"]),
                playlist_pos=row["pos"],
            )
            yield vt

    def get_playback_history(self) -> Iterator[ElrLine]:
        cur = self._conn.execute("""
            SELECT pl.starttime, pl.station, pl.item, pl.duration,
                   i.title, i.artist
            FROM playlistlog pl
            LEFT JOIN items i ON pl.item = i.idx
            ORDER BY pl.starttime
        """)

        for row in cur:
            yield ElrLine(
                service_name="929FM",
                cart_number=row["item"],  # needs remapping
                title=row["title"] or "",
                artist=row["artist"] or "",
                start_datetime=_parse_datetime(row["starttime"]),
                length=_sec_to_ms(row["duration"]) if row["duration"] else 0,
            )

    def get_storage_mapping(self) -> dict[int, str]:
        if self._storage_paths:
            return self._storage_paths
        # Fall back to DB storage definitions (Windows paths)
        cur = self._conn.execute("SELECT idx, defaultLocation FROM storages")
        return {row["idx"]: row["defaultLocation"] or "" for row in cur}

    def _resolve_file_path(self, storage_id: Optional[int], filename: Optional[str]) -> Optional[str]:
        if not filename or not storage_id:
            return None
        base = self._storage_paths.get(storage_id)
        if base:
            return f"{base}/{filename}"
        return filename

    def close(self) -> None:
        self._conn.close()
