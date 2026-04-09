"""Port: Persistence (write interface to target cart-based database)."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from ..domain.models import (
    Cart, Cut, Group, Log, LogLine, ElrLine, MigrationRecord
)


class PersistencePort(ABC):
    """Write interface to a Rivendell-compatible cart-based database.

    Implementations:
    - SqlitePersistenceAdapter: local SQLite for testing
    - PostgresPersistenceAdapter: PostgreSQL for staging/production
    """

    @abstractmethod
    def initialize_schema(self) -> None:
        """Create tables if they don't exist."""

    @abstractmethod
    def save_service(self, name: str, description: str = "") -> None:
        """Insert or update a service."""

    @abstractmethod
    def save_group(self, group: Group) -> None:
        """Insert or update a group."""

    @abstractmethod
    def save_cart(self, cart: Cart) -> None:
        """Insert or update a cart with all its cuts."""

    @abstractmethod
    def save_log(self, log: Log) -> None:
        """Insert or update a log with all its lines."""

    @abstractmethod
    def save_elr_line(self, line: ElrLine) -> None:
        """Insert a playback history record."""

    @abstractmethod
    def save_migration_record(self, record: MigrationRecord) -> None:
        """Track source→target mapping."""

    @abstractmethod
    def get_migration_record(
        self, source_system: str, source_id: str
    ) -> Optional[MigrationRecord]:
        """Look up existing migration mapping."""

    @abstractmethod
    def get_next_cart_number(self, group_name: str) -> int:
        """Return the next available cart number within a group's range."""

    @abstractmethod
    def get_cart(self, number: int) -> Optional[Cart]:
        """Look up a cart by number."""

    @abstractmethod
    def get_cart_by_song_id(self, song_id: str) -> Optional[Cart]:
        """Look up a cart by song_id (external ID)."""

    @abstractmethod
    def commit(self) -> None:
        """Commit current transaction."""

    @abstractmethod
    def rollback(self) -> None:
        """Rollback current transaction."""

    @abstractmethod
    def close(self) -> None:
        """Release resources."""

    def __enter__(self):
        return self

    def __exit__(self, exc_type, *args):
        if exc_type:
            self.rollback()
        self.close()
