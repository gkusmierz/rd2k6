"""Integration tests: MairList → cart-based migration on real test data."""

import os
import sys
import unittest

# Add parent to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from migration.adapters.mairlist.adapter import MairListAdapter, GROUP_DEFS
from migration.adapters.persistence.sqlite_adapter import SqlitePersistenceAdapter
from migration.adapters.mediafiles.local_adapter import LocalMediaAdapter
from migration.domain.models import CodingFormat, CartType
from migration.migrate import MigrationService

MAIRLIST_DB = "/data/929-sync-2025-03-14/dump/20250314.mldb"
STORAGE_PATHS = {
    1: "/data/929-sync-2025-03-14/mus",
    2: "/data/929-sync-2025-03-14/jin",
    3: "/data/929-sync-2025-03-14/bed",
    4: "/data/929-sync-2025-03-14/nws",
    5: "/data/929-sync-2025-03-14/drn",
    6: "/data/929-sync-2025-03-14/vtx",
}

DB_AVAILABLE = os.path.isfile(MAIRLIST_DB)


@unittest.skipUnless(DB_AVAILABLE, "MairList test database not available")
class TestMairListAdapter(unittest.TestCase):

    def setUp(self):
        self.adapter = MairListAdapter(MAIRLIST_DB, STORAGE_PATHS)

    def tearDown(self):
        self.adapter.close()

    def test_groups_returned(self):
        groups = self.adapter.get_groups()
        self.assertGreater(len(groups), 0)
        names = {g.name for g in groups}
        self.assertIn("MUSIC", names)
        self.assertIn("JINGLE", names)
        self.assertIn("VOICE", names)

    def test_item_count(self):
        count = self.adapter.get_item_count()
        self.assertEqual(count, 2296)

    def test_music_items(self):
        count = self.adapter.get_item_count("MUSIC")
        self.assertGreater(count, 2000)

    def test_first_item_structure(self):
        cart = next(self.adapter.get_items())
        self.assertIsNotNone(cart)
        self.assertEqual(cart.title, "Break it down again")
        self.assertEqual(cart.artist, "Tears For Fears")
        self.assertEqual(cart.group_name, "MUSIC")
        self.assertGreater(cart.average_length, 0)
        self.assertEqual(len(cart.cuts), 1)

        cut = cart.cuts[0]
        self.assertGreater(cut.length, 0)
        self.assertEqual(cut.coding_format, CodingFormat.FLAC)
        self.assertLess(cut.play_gain, 0)  # amplification was -7.0
        self.assertIsNotNone(cut.source_file_path)

    def test_cue_points_loaded(self):
        # Find an item with cue markers
        for cart in self.adapter.get_items():
            cut = cart.cuts[0]
            if cut.cue_points.segue_start_point > -1:
                self.assertGreater(cut.cue_points.segue_start_point, 0)
                return
        self.fail("No items with segue markers found")

    def test_voicetracks(self):
        vts = list(self.adapter.get_voicetracks())
        self.assertGreater(len(vts), 0)
        vt = vts[0]
        self.assertTrue(vt.filename.startswith("VoiceTrack-"))
        self.assertGreater(vt.duration, 0)

    def test_logs(self):
        logs = list(self.adapter.get_logs())
        self.assertGreater(len(logs), 0)
        log = logs[0]
        self.assertTrue(log.name.startswith("2025-"))
        self.assertGreater(len(log.lines), 0)

    def test_playback_history(self):
        history = list(self.adapter.get_playback_history())
        self.assertEqual(len(history), 12452)

    def test_storage_mapping(self):
        mapping = self.adapter.get_storage_mapping()
        self.assertEqual(len(mapping), 6)
        self.assertIn(1, mapping)
        self.assertTrue(mapping[1].endswith("/mus"))


@unittest.skipUnless(DB_AVAILABLE, "MairList test database not available")
class TestSqlitePersistence(unittest.TestCase):

    def setUp(self):
        self.adapter = SqlitePersistenceAdapter(":memory:")
        self.adapter.initialize_schema()

    def tearDown(self):
        self.adapter.close()

    def test_schema_created(self):
        self.assertIsNotNone(self.adapter)

    def test_save_group(self):
        from migration.domain.models import Group
        g = Group("TEST", "Test Group", default_low_cart=1000, default_high_cart=1999)
        self.adapter.save_group(g)
        self.adapter.commit()
        next_num = self.adapter.get_next_cart_number("TEST")
        self.assertEqual(next_num, 1000)

    def test_save_cart(self):
        from migration.domain.models import Group, Cart, Cut, CuePoints
        g = Group("MUSIC", "Music", default_low_cart=10000, default_high_cart=19999)
        self.adapter.save_group(g)

        cart = Cart(
            number=0, group_name="MUSIC",
            title="Test Song", artist="Test Artist",
            cuts=[Cut(cut_name="", cart_number=0, length=180000)]
        )
        self.adapter.save_cart(cart)
        self.adapter.commit()

        self.assertEqual(cart.number, 10000)
        self.assertEqual(self.adapter.count_carts(), 1)
        self.assertEqual(self.adapter.count_cuts(), 1)

        loaded = self.adapter.get_cart(10000)
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.title, "Test Song")

    def test_cart_auto_increment(self):
        from migration.domain.models import Group, Cart, Cut
        g = Group("MUSIC", "Music", default_low_cart=10000, default_high_cart=19999)
        self.adapter.save_group(g)

        for i in range(3):
            cart = Cart(number=0, group_name="MUSIC", title=f"Song {i}",
                        cuts=[Cut(cut_name="", cart_number=0)])
            self.adapter.save_cart(cart)

        self.adapter.commit()
        self.assertEqual(self.adapter.count_carts(), 3)

    def test_migration_record(self):
        from migration.domain.models import MigrationRecord
        rec = MigrationRecord("mairlist", "42", "0001M01", 10000, "010000_001", "done")
        self.adapter.save_migration_record(rec)
        self.adapter.commit()

        loaded = self.adapter.get_migration_record("mairlist", "42")
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.target_cart_number, 10000)
        self.assertEqual(loaded.status, "done")


@unittest.skipUnless(DB_AVAILABLE, "MairList test database not available")
class TestFullMigration(unittest.TestCase):
    """End-to-end migration test using real MairList data."""

    def test_full_migration(self):
        source = MairListAdapter(MAIRLIST_DB, STORAGE_PATHS)
        target = SqlitePersistenceAdapter(":memory:")
        media = LocalMediaAdapter(STORAGE_PATHS)

        service = MigrationService(
            source=source, target=target, media=media,
            copy_media=False,
        )

        stats = service.run_full_migration()

        # Verify counts
        self.assertEqual(stats.groups, 9)
        self.assertGreaterEqual(stats.carts, 2290)  # ~2296, some may have edge cases
        self.assertEqual(stats.carts, stats.cuts)    # 1:1 cart:cut
        self.assertGreater(stats.voicetracks, 0)
        self.assertGreater(stats.logs, 0)
        self.assertGreater(stats.log_lines, 0)
        self.assertEqual(stats.errors, 0)

        # Verify persistence
        self.assertEqual(target.count_carts(), stats.carts + stats.voicetracks)
        self.assertEqual(target.count_cuts(), stats.cuts + stats.voicetracks)
        self.assertGreater(target.count_logs(), 0)
        self.assertGreater(target.count_log_lines(), 0)

        # Verify a known cart
        cart = target.get_cart_by_song_id("0001M01")
        self.assertIsNotNone(cart)
        self.assertEqual(cart.title, "Break it down again")
        self.assertEqual(cart.group_name, "MUSIC")

        # Verify cart number ranges
        self.assertGreaterEqual(cart.number, 10000)
        self.assertLessEqual(cart.number, 19999)

        source.close()
        target.close()


@unittest.skipUnless(DB_AVAILABLE, "MairList test database not available")
class TestMediaAdapter(unittest.TestCase):

    def test_file_exists(self):
        media = LocalMediaAdapter(STORAGE_PATHS)
        self.assertTrue(media.file_exists("/data/929-sync-2025-03-14/mus/0001M01.flac"))
        self.assertFalse(media.file_exists("/nonexistent/file.wav"))
        media.close()

    def test_resolve_source_path(self):
        media = LocalMediaAdapter(STORAGE_PATHS)
        path = media.resolve_source_path(1, "0001M01.flac")
        self.assertEqual(path, "/data/929-sync-2025-03-14/mus/0001M01.flac")
        media.close()

    def test_resolve_voicetrack(self):
        media = LocalMediaAdapter(STORAGE_PATHS)
        # Pick a known VT file
        vt_files = media.list_files("/data/929-sync-2025-03-14/vtx/", "VoiceTrack-*.wav")
        self.assertGreater(len(vt_files), 0)

        filename = os.path.basename(vt_files[0])
        resolved = media.resolve_voicetrack_path(filename)
        self.assertIsNotNone(resolved)
        self.assertTrue(os.path.isfile(resolved))
        media.close()

    def test_list_files(self):
        media = LocalMediaAdapter(STORAGE_PATHS)
        files = media.list_files("/data/929-sync-2025-03-14/mus/", "*.flac")
        self.assertGreater(len(files), 2000)
        media.close()


if __name__ == "__main__":
    unittest.main()
