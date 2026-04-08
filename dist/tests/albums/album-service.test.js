"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const database_1 = require("@/common/database");
const album_repository_1 = require("@/albums/album-repository");
const album_service_1 = require("@/albums/album-service");
(0, vitest_1.describe)("AlbumService", () => {
    let db;
    let repo;
    let service;
    (0, vitest_1.beforeEach)(() => {
        db = (0, database_1.createTestDatabase)();
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user1', 'a@b.com', 'User 1')`);
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user2', 'c@d.com', 'User 2')`);
        repo = new album_repository_1.AlbumRepository(db);
        service = new album_service_1.AlbumService(repo);
    });
    (0, vitest_1.afterEach)(() => {
        db.close();
    });
    (0, vitest_1.describe)("createAlbum", () => {
        (0, vitest_1.it)("creates an album with valid name and description", async () => {
            const result = await service.createAlbum({
                name: "Vacation",
                description: "Summer 2024",
                userId: "user1",
            });
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.name).toBe("Vacation");
                (0, vitest_1.expect)(result.data.description).toBe("Summer 2024");
                (0, vitest_1.expect)(result.data.userId).toBe("user1");
                (0, vitest_1.expect)(result.data.id).toBeTruthy();
            }
        });
        (0, vitest_1.it)("creates an album with optional description omitted", async () => {
            const result = await service.createAlbum({ name: "Quick", userId: "user1" });
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.description).toBe("");
            }
        });
        (0, vitest_1.it)("rejects creation with empty name", async () => {
            const result = await service.createAlbum({ name: "", userId: "user1" });
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("validation");
                (0, vitest_1.expect)(result.error.fields[0].field).toBe("name");
            }
        });
        (0, vitest_1.it)("rejects creation with whitespace-only name", async () => {
            const result = await service.createAlbum({ name: "   ", userId: "user1" });
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("validation");
            }
        });
        (0, vitest_1.it)("rejects creation with name exceeding 255 characters", async () => {
            const result = await service.createAlbum({ name: "a".repeat(256), userId: "user1" });
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("validation");
            }
        });
        (0, vitest_1.it)("rejects creation with description exceeding 1000 characters", async () => {
            const result = await service.createAlbum({
                name: "Valid",
                description: "x".repeat(1001),
                userId: "user1",
            });
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("validation");
            }
        });
    });
    (0, vitest_1.describe)("updateAlbum", () => {
        (0, vitest_1.it)("updates album name and description", async () => {
            const created = await service.createAlbum({ name: "Old", description: "Old desc", userId: "user1" });
            if (!created.success)
                throw new Error("setup failed");
            const result = await service.updateAlbum(created.data.id, { name: "New", description: "New desc" }, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.name).toBe("New");
                (0, vitest_1.expect)(result.data.description).toBe("New desc");
            }
        });
        (0, vitest_1.it)("refreshes updatedAt on update", async () => {
            const created = await service.createAlbum({ name: "Album", userId: "user1" });
            if (!created.success)
                throw new Error("setup failed");
            const oldUpdated = created.data.updatedAt;
            // Small delay to ensure different timestamp
            await new Promise((r) => setTimeout(r, 10));
            const result = await service.updateAlbum(created.data.id, { name: "Updated" }, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.updatedAt).not.toBe(oldUpdated);
            }
        });
        (0, vitest_1.it)("returns not_found for nonexistent album", async () => {
            const result = await service.updateAlbum("nonexistent", { name: "x" }, "user1");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("not_found");
            }
        });
        (0, vitest_1.it)("returns forbidden when user does not own the album", async () => {
            const created = await service.createAlbum({ name: "Album", userId: "user1" });
            if (!created.success)
                throw new Error("setup failed");
            const result = await service.updateAlbum(created.data.id, { name: "Hacked" }, "user2");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("forbidden");
            }
        });
    });
    (0, vitest_1.describe)("deleteAlbum", () => {
        (0, vitest_1.it)("deletes an album owned by the user", async () => {
            const created = await service.createAlbum({ name: "Delete Me", userId: "user1" });
            if (!created.success)
                throw new Error("setup failed");
            const result = await service.deleteAlbum(created.data.id, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
            const get = await service.getAlbum(created.data.id, "user1");
            (0, vitest_1.expect)(get.success).toBe(false);
        });
        (0, vitest_1.it)("returns not_found for nonexistent album", async () => {
            const result = await service.deleteAlbum("nonexistent", "user1");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("not_found");
            }
        });
        (0, vitest_1.it)("returns forbidden when user does not own the album", async () => {
            const created = await service.createAlbum({ name: "Protected", userId: "user1" });
            if (!created.success)
                throw new Error("setup failed");
            const result = await service.deleteAlbum(created.data.id, "user2");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("forbidden");
            }
        });
    });
    (0, vitest_1.describe)("listAlbums", () => {
        (0, vitest_1.it)("lists albums for a user ordered by updatedAt descending", async () => {
            await service.createAlbum({ name: "First", userId: "user1" });
            await new Promise((r) => setTimeout(r, 10));
            await service.createAlbum({ name: "Second", userId: "user1" });
            const result = await service.listAlbums("user1", { page: 1, limit: 10 });
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.items).toHaveLength(2);
                (0, vitest_1.expect)(result.data.items[0].name).toBe("Second");
                (0, vitest_1.expect)(result.data.items[1].name).toBe("First");
            }
        });
        (0, vitest_1.it)("returns empty list for user with no albums", async () => {
            const result = await service.listAlbums("user1", { page: 1, limit: 10 });
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.items).toHaveLength(0);
                (0, vitest_1.expect)(result.data.totalCount).toBe(0);
            }
        });
    });
    (0, vitest_1.describe)("getAlbum", () => {
        (0, vitest_1.it)("returns album when owned by user", async () => {
            const created = await service.createAlbum({ name: "My Album", userId: "user1" });
            if (!created.success)
                throw new Error("setup failed");
            const result = await service.getAlbum(created.data.id, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.name).toBe("My Album");
            }
        });
        (0, vitest_1.it)("returns forbidden when user does not own the album", async () => {
            const created = await service.createAlbum({ name: "Private", userId: "user1" });
            if (!created.success)
                throw new Error("setup failed");
            const result = await service.getAlbum(created.data.id, "user2");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("forbidden");
            }
        });
        (0, vitest_1.it)("returns not_found for nonexistent album", async () => {
            const result = await service.getAlbum("nonexistent", "user1");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("not_found");
            }
        });
    });
});
//# sourceMappingURL=album-service.test.js.map