"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = getDatabase;
exports.closeDatabase = closeDatabase;
exports.createTestDatabase = createTestDatabase;
exports.runMigrations = runMigrations;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
let db = null;
function getDatabase(dbPath = ":memory:") {
    if (!db) {
        db = new better_sqlite3_1.default(dbPath);
        db.pragma("journal_mode = WAL");
        db.pragma("foreign_keys = ON");
    }
    return db;
}
function closeDatabase() {
    if (db) {
        db.close();
        db = null;
    }
}
function createTestDatabase() {
    const testDb = new better_sqlite3_1.default(":memory:");
    testDb.pragma("journal_mode = WAL");
    testDb.pragma("foreign_keys = ON");
    runMigrations(testDb);
    return testDb;
}
function runMigrations(database) {
    database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_albums_user_updated
      ON albums(user_id, updated_at DESC);

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      album_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      original_url TEXT NOT NULL,
      thumbnail_url TEXT,
      thumbnail_status TEXT NOT NULL DEFAULT 'pending',
      original_name TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_photos_album_uploaded
      ON photos(album_id, uploaded_at);

    CREATE TABLE IF NOT EXISTS photo_tags (
      photo_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      PRIMARY KEY (photo_id, tag),
      FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_photo_tags_tag
      ON photo_tags(tag);

    CREATE TABLE IF NOT EXISTS shares (
      id TEXT PRIMARY KEY,
      resource_type TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      recipient_user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (owner_user_id) REFERENCES users(id),
      FOREIGN KEY (recipient_user_id) REFERENCES users(id)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_shares_unique
      ON shares(resource_type, resource_id, recipient_user_id);

    CREATE INDEX IF NOT EXISTS idx_shares_recipient
      ON shares(recipient_user_id, resource_type);
  `);
}
//# sourceMappingURL=database.js.map