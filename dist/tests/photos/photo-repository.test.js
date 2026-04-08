"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const database_1 = require("@/common/database");
const photo_repository_1 = require("@/photos/photo-repository");
(0, vitest_1.describe)("PhotoRepository", () => {
    let db;
    let repo;
    (0, vitest_1.beforeEach)(() => {
        db = (0, database_1.createTestDatabase)();
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user1', 'a@b.com', 'User 1')`);
        db.exec(`INSERT INTO albums (id, user_id, name, description, created_at, updated_at)
             VALUES ('album1', 'user1', 'Test Album', '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')`);
        repo = new photo_repository_1.PhotoRepository(db);
    });
    (0, vitest_1.afterEach)(() => {
        db.close();
    });
    (0, vitest_1.describe)("create", () => {
        (0, vitest_1.it)("creates a photo record", () => {
            const photo = repo.create({
                id: "p1",
                albumId: "album1",
                userId: "user1",
                originalUrl: "/files/originals/p1.jpg",
                thumbnailUrl: null,
                thumbnailStatus: "pending",
                originalName: "vacation.jpg",
                sizeBytes: 1024,
                mimeType: "image/jpeg",
                uploadedAt: "2024-06-01T00:00:00Z",
            });
            (0, vitest_1.expect)(photo.id).toBe("p1");
            (0, vitest_1.expect)(photo.albumId).toBe("album1");
            (0, vitest_1.expect)(photo.thumbnailStatus).toBe("pending");
        });
    });
    (0, vitest_1.describe)("findById", () => {
        (0, vitest_1.it)("returns photo when found", () => {
            repo.create({
                id: "p1", albumId: "album1", userId: "user1",
                originalUrl: "/files/p1.jpg", thumbnailUrl: null,
                thumbnailStatus: "pending", originalName: "test.jpg",
                sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z",
            });
            const found = repo.findById("p1");
            (0, vitest_1.expect)(found).not.toBeNull();
            (0, vitest_1.expect)(found.originalName).toBe("test.jpg");
        });
        (0, vitest_1.it)("returns null when not found", () => {
            (0, vitest_1.expect)(repo.findById("nonexistent")).toBeNull();
        });
    });
    (0, vitest_1.describe)("listByAlbum", () => {
        (0, vitest_1.it)("returns photos ordered by uploadedAt", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "p2", albumId: "album1", userId: "user1", originalUrl: "/f/2", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "b.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-03T00:00:00Z" });
            repo.create({ id: "p3", albumId: "album1", userId: "user1", originalUrl: "/f/3", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "c.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-02T00:00:00Z" });
            const result = repo.listByAlbum("album1", { page: 1, limit: 10 });
            (0, vitest_1.expect)(result.items).toHaveLength(3);
            (0, vitest_1.expect)(result.items[0].id).toBe("p1");
            (0, vitest_1.expect)(result.items[1].id).toBe("p3");
            (0, vitest_1.expect)(result.items[2].id).toBe("p2");
        });
        (0, vitest_1.it)("paginates results", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "p2", albumId: "album1", userId: "user1", originalUrl: "/f/2", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "b.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-02T00:00:00Z" });
            repo.create({ id: "p3", albumId: "album1", userId: "user1", originalUrl: "/f/3", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "c.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-03T00:00:00Z" });
            const page1 = repo.listByAlbum("album1", { page: 1, limit: 2 });
            (0, vitest_1.expect)(page1.items).toHaveLength(2);
            (0, vitest_1.expect)(page1.hasMore).toBe(true);
        });
    });
    (0, vitest_1.describe)("getWithNavigation", () => {
        (0, vitest_1.it)("returns photo with next and previous IDs", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "p2", albumId: "album1", userId: "user1", originalUrl: "/f/2", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "b.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-02T00:00:00Z" });
            repo.create({ id: "p3", albumId: "album1", userId: "user1", originalUrl: "/f/3", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "c.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-03T00:00:00Z" });
            const nav = repo.getWithNavigation("p2");
            (0, vitest_1.expect)(nav).not.toBeNull();
            (0, vitest_1.expect)(nav.previousPhotoId).toBe("p1");
            (0, vitest_1.expect)(nav.nextPhotoId).toBe("p3");
        });
        (0, vitest_1.it)("returns null for previous on first photo", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "p2", albumId: "album1", userId: "user1", originalUrl: "/f/2", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "b.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-02T00:00:00Z" });
            const nav = repo.getWithNavigation("p1");
            (0, vitest_1.expect)(nav.previousPhotoId).toBeNull();
            (0, vitest_1.expect)(nav.nextPhotoId).toBe("p2");
        });
        (0, vitest_1.it)("returns null for next on last photo", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "p2", albumId: "album1", userId: "user1", originalUrl: "/f/2", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "b.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-02T00:00:00Z" });
            const nav = repo.getWithNavigation("p2");
            (0, vitest_1.expect)(nav.previousPhotoId).toBe("p1");
            (0, vitest_1.expect)(nav.nextPhotoId).toBeNull();
        });
    });
    (0, vitest_1.describe)("updateThumbnail", () => {
        (0, vitest_1.it)("updates thumbnail URL and status", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            repo.updateThumbnail("p1", "/files/thumb/p1.jpg", "ready");
            const updated = repo.findById("p1");
            (0, vitest_1.expect)(updated.thumbnailUrl).toBe("/files/thumb/p1.jpg");
            (0, vitest_1.expect)(updated.thumbnailStatus).toBe("ready");
        });
    });
    (0, vitest_1.describe)("delete", () => {
        (0, vitest_1.it)("deletes a photo", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            (0, vitest_1.expect)(repo.delete("p1")).toBe(true);
            (0, vitest_1.expect)(repo.findById("p1")).toBeNull();
        });
    });
    (0, vitest_1.describe)("deleteByAlbum", () => {
        (0, vitest_1.it)("deletes all photos in an album", () => {
            repo.create({ id: "p1", albumId: "album1", userId: "user1", originalUrl: "/f/1", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "a.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "p2", albumId: "album1", userId: "user1", originalUrl: "/f/2", thumbnailUrl: null, thumbnailStatus: "pending", originalName: "b.jpg", sizeBytes: 100, mimeType: "image/jpeg", uploadedAt: "2024-01-02T00:00:00Z" });
            const count = repo.deleteByAlbum("album1");
            (0, vitest_1.expect)(count).toBe(2);
            (0, vitest_1.expect)(repo.listByAlbum("album1", { page: 1, limit: 10 }).items).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=photo-repository.test.js.map