"""Port: Source Data Access (read-only interface to source radio automation system)."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Iterator, Optional

from ..domain.models import (
    Cart, Cut, CuePoints, Group, Log, LogLine, ElrLine, VoiceTrack
)


class SourceDataPort(ABC):
    """Read-only interface to a source radio automation database.

    Implementations:
    - MairListAdapter: reads MairList SQLite database
    - (future) RivendellSourceAdapter: reads Rivendell MySQL for migration between instances
    """

    @abstractmethod
    def get_groups(self) -> list[Group]:
        """Return all content groups/categories from the source system."""

    @abstractmethod
    def get_items(self, group: Optional[str] = None) -> Iterator[Cart]:
        """Yield Cart objects (with Cuts) for all items, optionally filtered by group.

        Each source item should be mapped to one Cart with one Cut.
        Cue points should be populated from source marker data.
        """

    @abstractmethod
    def get_item_count(self, group: Optional[str] = None) -> int:
        """Return total number of items, optionally filtered by group."""

    @abstractmethod
    def get_logs(self) -> Iterator[Log]:
        """Yield Log objects with their LogLines from source playlists."""

    @abstractmethod
    def get_voicetracks(self) -> Iterator[VoiceTrack]:
        """Yield VoiceTrack references extracted from playlists."""

    @abstractmethod
    def get_playback_history(self) -> Iterator[ElrLine]:
        """Yield playback history entries."""

    @abstractmethod
    def get_storage_mapping(self) -> dict[int, str]:
        """Return mapping of storage_id → base directory path."""

    @abstractmethod
    def close(self) -> None:
        """Release any resources."""

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
