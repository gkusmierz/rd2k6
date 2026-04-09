"""Port: Media File Access (interface to audio file storage)."""

from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional


class MediaFilePort(ABC):
    """Interface to audio file storage for reading/writing media files.

    Source side: read files from MairList storage directories
    Target side: write files to Rivendell /var/snd/ structure

    Implementations:
    - LocalMediaAdapter: direct filesystem access
    - (future) SshMediaAdapter: remote file access via SSH/SFTP
    """

    @abstractmethod
    def file_exists(self, path: str) -> bool:
        """Check if a media file exists at the given path."""

    @abstractmethod
    def get_file_info(self, path: str) -> Optional[dict]:
        """Return file metadata: size, format, duration, sample_rate, channels.

        Returns None if file doesn't exist.
        """

    @abstractmethod
    def copy_file(self, source_path: str, target_path: str) -> bool:
        """Copy a media file from source to target location.

        Returns True if successful.
        """

    @abstractmethod
    def resolve_source_path(self, storage_id: int, filename: str) -> str:
        """Resolve a MairList storage reference to an absolute file path.

        E.g. storage_id=1, filename='0001M01.flac' → '/data/929-sync.../mus/0001M01.flac'
        """

    @abstractmethod
    def get_target_path(self, cut_name: str) -> str:
        """Return the target file path for a Rivendell cut.

        E.g. cut_name='010001_001' → '/var/snd/010001_001.wav'
        """

    @abstractmethod
    def list_files(self, directory: str, pattern: str = "*") -> list[str]:
        """List files in a directory matching the pattern."""

    @abstractmethod
    def close(self) -> None:
        """Release resources."""

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
