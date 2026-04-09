#!/usr/bin/env python3
"""CLI entry point for MairList → Rivendell migration."""

import argparse
import logging
import sys

from .adapters.mairlist.adapter import MairListAdapter
from .adapters.persistence.sqlite_adapter import SqlitePersistenceAdapter
from .adapters.mediafiles.local_adapter import LocalMediaAdapter
from .migrate import MigrationService

DEFAULT_STORAGE_PATHS = {
    1: "/data/929-sync-2025-03-14/mus",
    2: "/data/929-sync-2025-03-14/jin",
    3: "/data/929-sync-2025-03-14/bed",
    4: "/data/929-sync-2025-03-14/nws",
    5: "/data/929-sync-2025-03-14/drn",
    6: "/data/929-sync-2025-03-14/vtx",
}


def main():
    parser = argparse.ArgumentParser(
        description="Migrate MairList data to Rivendell cart-based schema"
    )
    parser.add_argument(
        "source_db",
        help="Path to MairList .mldb SQLite database",
    )
    parser.add_argument(
        "-o", "--output",
        default="rivendell_test.db",
        help="Output SQLite database path (default: rivendell_test.db)",
    )
    parser.add_argument(
        "--copy-media",
        action="store_true",
        help="Copy media files to target directory",
    )
    parser.add_argument(
        "--target-audio-dir",
        default="/tmp/rivendell_snd",
        help="Target audio directory (default: /tmp/rivendell_snd)",
    )
    parser.add_argument(
        "--voicetrack-dir",
        help="Override voicetrack file directory",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose logging",
    )
    parser.add_argument(
        "--postgres",
        help="Use PostgreSQL instead of SQLite. Format: host:port/dbname?user=X&password=Y",
    )

    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    source = MairListAdapter(args.source_db, DEFAULT_STORAGE_PATHS)

    if args.postgres:
        from .adapters.persistence.postgres_adapter import PostgresPersistenceAdapter
        # Parse connection string
        parts = args.postgres.split("/")
        host_port = parts[0].split(":")
        host = host_port[0]
        port = int(host_port[1]) if len(host_port) > 1 else 5432
        rest = parts[1] if len(parts) > 1 else "rivendell"
        dbname = rest.split("?")[0]
        params = {}
        if "?" in rest:
            for p in rest.split("?")[1].split("&"):
                k, v = p.split("=")
                params[k] = v
        target = PostgresPersistenceAdapter(
            host=host, port=port, dbname=dbname,
            user=params.get("user", "rduser"),
            password=params.get("password", ""),
        )
    else:
        target = SqlitePersistenceAdapter(args.output)

    media = LocalMediaAdapter(
        storage_base_paths=DEFAULT_STORAGE_PATHS,
        target_audio_dir=args.target_audio_dir,
        voicetrack_dir=args.voicetrack_dir,
    )

    service = MigrationService(
        source=source,
        target=target,
        media=media,
        copy_media=args.copy_media,
    )

    stats = service.run_full_migration()

    print(f"\n=== Migration Summary ===")
    print(f"  Groups:      {stats.groups}")
    print(f"  Carts:       {stats.carts}")
    print(f"  Cuts:        {stats.cuts}")
    print(f"  VoiceTracks: {stats.voicetracks}")
    print(f"  Logs:        {stats.logs}")
    print(f"  Log Lines:   {stats.log_lines}")
    print(f"  ELR Lines:   {stats.elr_lines}")
    print(f"  Skipped:     {stats.skipped}")
    print(f"  Errors:      {stats.errors}")

    source.close()
    target.close()
    media.close()

    return 0 if stats.errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
