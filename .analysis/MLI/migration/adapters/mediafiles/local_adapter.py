"""Local filesystem media file adapter."""

from __future__ import annotations

import os
import shutil
from fnmatch import fnmatch
from pathlib import Path
from typing import Optional

from ...ports.media_port import MediaFilePort


class LocalMediaAdapter(MediaFilePort):
    """Direct filesystem access to audio files.

    Handles both source (MairList) and target (Rivendell) file layouts.
    """

    def __init__(
        self,
        storage_base_paths: dict[int, str],
        target_audio_dir: str = "/var/snd",
        voicetrack_dir: Optional[str] = None,
    ):
        """
        Args:
            storage_base_paths: MairList storage_id → local directory path
            target_audio_dir: Rivendell audio storage directory
            voicetrack_dir: Override directory for voicetrack files
        """
        self._storage_paths = storage_base_paths
        self._target_dir = target_audio_dir
        self._vtx_dir = voicetrack_dir

    def file_exists(self, path: str) -> bool:
        return os.path.isfile(path)

    def get_file_info(self, path: str) -> Optional[dict]:
        if not os.path.isfile(path):
            return None

        stat = os.stat(path)
        ext = os.path.splitext(path)[1].lower()

        info = {
            "size": stat.st_size,
            "format": ext.lstrip("."),
            "path": path,
        }

        # Try to get audio metadata via mutagen (if available)
        try:
            import mutagen
            audio = mutagen.File(path)
            if audio:
                info["duration"] = audio.info.length if hasattr(audio.info, "length") else None
                info["sample_rate"] = audio.info.sample_rate if hasattr(audio.info, "sample_rate") else None
                info["channels"] = audio.info.channels if hasattr(audio.info, "channels") else None
        except (ImportError, Exception):
            pass

        return info

    def copy_file(self, source_path: str, target_path: str) -> bool:
        if not os.path.isfile(source_path):
            return False

        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        shutil.copy2(source_path, target_path)
        return True

    def resolve_source_path(self, storage_id: int, filename: str) -> str:
        base = self._storage_paths.get(storage_id, "")
        if not base:
            return filename

        # Handle filenames with subdirectories
        full_path = os.path.join(base, filename)
        if os.path.isfile(full_path):
            return full_path

        # Try searching in subdirectories
        for root, _, files in os.walk(base):
            if filename in files:
                return os.path.join(root, filename)

        return full_path

    def resolve_voicetrack_path(self, vt_filename: str) -> Optional[str]:
        """Resolve voicetrack filename to physical path.

        Checks: voicetrack_dir override → storage 6 (vtx) → None
        """
        if self._vtx_dir:
            path = os.path.join(self._vtx_dir, vt_filename)
            if os.path.isfile(path):
                return path

        vtx_base = self._storage_paths.get(6)
        if vtx_base:
            path = os.path.join(vtx_base, vt_filename)
            if os.path.isfile(path):
                return path

        return None

    def get_target_path(self, cut_name: str) -> str:
        return os.path.join(self._target_dir, f"{cut_name}.wav")

    def list_files(self, directory: str, pattern: str = "*") -> list[str]:
        if not os.path.isdir(directory):
            return []
        return sorted(
            os.path.join(directory, f)
            for f in os.listdir(directory)
            if os.path.isfile(os.path.join(directory, f)) and fnmatch(f, pattern)
        )

    def close(self) -> None:
        pass
