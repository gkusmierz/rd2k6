"""Main migration orchestrator: MairList → Rivendell cart-based schema."""

from __future__ import annotations

import logging
import sys
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from .domain.models import MigrationRecord, VoiceTrack, Cart, Cut, CuePoints, CodingFormat
from .ports.source_port import SourceDataPort
from .ports.persistence_port import PersistencePort
from .ports.media_port import MediaFilePort

logger = logging.getLogger(__name__)


@dataclass
class MigrationStats:
    groups: int = 0
    carts: int = 0
    cuts: int = 0
    logs: int = 0
    log_lines: int = 0
    voicetracks: int = 0
    elr_lines: int = 0
    skipped: int = 0
    errors: int = 0


class MigrationService:
    """Orchestrates data migration from source system to cart-based target."""

    def __init__(
        self,
        source: SourceDataPort,
        target: PersistencePort,
        media: Optional[MediaFilePort] = None,
        source_system_name: str = "mairlist",
        copy_media: bool = False,
    ):
        self.source = source
        self.target = target
        self.media = media
        self.source_system_name = source_system_name
        self.copy_media = copy_media
        self.stats = MigrationStats()
        # Mapping: source item idx → target cart number
        self._item_to_cart: dict[int, int] = {}

    def run_full_migration(self) -> MigrationStats:
        """Execute complete migration pipeline."""
        logger.info("Starting full migration from %s", self.source_system_name)

        self.target.initialize_schema()
        self._create_default_service()
        self.migrate_groups()
        self.migrate_items()
        self.migrate_voicetracks()
        self.migrate_logs()
        self.migrate_playback_history()
        self.target.commit()

        logger.info(
            "Migration complete: %d carts, %d cuts, %d logs, %d VTs, %d errors",
            self.stats.carts, self.stats.cuts, self.stats.logs,
            self.stats.voicetracks, self.stats.errors,
        )
        return self.stats

    def _create_default_service(self) -> None:
        """Ensure the default service exists for log references."""
        from .domain.models import Log
        self.target.save_service("929FM", "Radio 929 FM")
        self.target.commit()

    def migrate_groups(self) -> None:
        """Migrate content groups."""
        logger.info("Migrating groups...")
        for group in self.source.get_groups():
            self.target.save_group(group)
            self.stats.groups += 1
        self.target.commit()
        logger.info("  %d groups migrated", self.stats.groups)

    def migrate_items(self) -> None:
        """Migrate all source items as carts with cuts."""
        total = self.source.get_item_count()
        logger.info("Migrating %d items...", total)

        for i, cart in enumerate(self.source.get_items()):
            src_idx = cart._source_idx if cart._source_idx is not None else i
            try:
                source_id = f"item:{src_idx}"
                existing = self.target.get_migration_record(
                    self.source_system_name, source_id
                )
                if existing and existing.status == "done":
                    self._item_to_cart[src_idx] = existing.target_cart_number or 0
                    self.stats.skipped += 1
                    continue

                self.target.save_cart(cart)
                self.stats.carts += 1
                self.stats.cuts += len(cart.cuts)

                self._item_to_cart[src_idx] = cart.number

                cut_name = cart.cuts[0].cut_name if cart.cuts else ""
                self.target.save_migration_record(MigrationRecord(
                    source_system=self.source_system_name,
                    source_id=source_id,
                    source_external_id=cart.song_id,
                    target_cart_number=cart.number,
                    target_cut_name=cut_name,
                    status="done",
                ))

                # Copy media file if requested
                if self.copy_media and self.media and cart.cuts:
                    cut = cart.cuts[0]
                    if cut.source_file_path:
                        target_path = self.media.get_target_path(cut.cut_name)
                        self.media.copy_file(cut.source_file_path, target_path)

                if (i + 1) % 500 == 0:
                    self.target.commit()
                    logger.info("  %d/%d items processed", i + 1, total)

            except Exception as e:
                logger.error("Error migrating item %s (idx=%s): %s", cart.song_id or i, src_idx, e)
                self.stats.errors += 1

        self.target.commit()
        logger.info("  %d carts, %d cuts migrated", self.stats.carts, self.stats.cuts)

    def migrate_voicetracks(self) -> None:
        """Migrate voicetracks extracted from playlist XML."""
        logger.info("Migrating voicetracks...")

        seen_files: set[str] = set()
        for vt in self.source.get_voicetracks():
            if not vt.filename or vt.filename in seen_files:
                continue
            seen_files.add(vt.filename)

            try:
                # Create cart for voicetrack
                duration_ms = round(vt.duration * 1000)
                segue_ms = round(vt.start_next * 1000) if vt.start_next > 0 else -1

                source_path = None
                if self.media:
                    source_path = self.media.resolve_voicetrack_path(vt.filename)

                cut = Cut(
                    cut_name="",
                    cart_number=0,
                    description=(vt.title or vt.filename)[:64],
                    length=duration_ms,
                    origin_name="MairList VoiceTrack",
                    coding_format=CodingFormat.PCM_WAV,
                    cue_points=CuePoints(
                        segue_start_point=segue_ms,
                        segue_end_point=duration_ms if segue_ms > -1 else -1,
                    ),
                    source_file_path=source_path,
                )

                cart = Cart(
                    number=0,
                    group_name="VOICE",
                    title=vt.title or vt.filename,
                    average_length=duration_ms,
                    cuts=[cut],
                )

                self.target.save_cart(cart)
                self.stats.voicetracks += 1

                self.target.save_migration_record(MigrationRecord(
                    source_system=self.source_system_name,
                    source_id=f"vt:{vt.filename}",
                    target_cart_number=cart.number,
                    target_cut_name=cart.cuts[0].cut_name if cart.cuts else "",
                    status="done",
                    notes=f"slot={vt.playlist_slot} pos={vt.playlist_pos}",
                ))

            except Exception as e:
                logger.error("Error migrating voicetrack %s: %s", vt.filename, e)
                self.stats.errors += 1

        self.target.commit()
        logger.info("  %d voicetracks migrated", self.stats.voicetracks)

    def migrate_logs(self) -> None:
        """Migrate playlists as Rivendell logs."""
        logger.info("Migrating logs...")

        for log in self.source.get_logs():
            try:
                # Remap cart numbers in log lines
                for line in log.lines:
                    if line.cart_number > 0:
                        mapped = self._item_to_cart.get(line.cart_number)
                        if mapped:
                            line.cart_number = mapped
                        else:
                            line.cart_number = 0

                self.target.save_log(log)
                self.stats.logs += 1
                self.stats.log_lines += len(log.lines)

            except Exception as e:
                logger.error("Error migrating log %s: %s", log.name, e)
                self.stats.errors += 1

        self.target.commit()
        logger.info("  %d logs, %d lines migrated", self.stats.logs, self.stats.log_lines)

    def migrate_playback_history(self) -> None:
        """Migrate playback history to ELR lines."""
        logger.info("Migrating playback history...")

        for elr in self.source.get_playback_history():
            try:
                # Remap cart number
                if elr.cart_number > 0:
                    mapped = self._item_to_cart.get(elr.cart_number)
                    if mapped:
                        elr.cart_number = mapped

                self.target.save_elr_line(elr)
                self.stats.elr_lines += 1
            except Exception as e:
                logger.error("Error migrating ELR: %s", e)
                self.stats.errors += 1

        self.target.commit()
        logger.info("  %d ELR lines migrated", self.stats.elr_lines)
