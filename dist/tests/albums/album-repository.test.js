"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const database_1 = require("@/common/database");
const album_repository_1 = require("@/albums/album-repository");
(0, vitest_1.describe)("AlbumRepository", () => {
    let db;
    let repo;
    (0, vitest_1.beforeEach)(() => {
        db = (0, database_1.createTestDatabase)();
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user1', 'a@b.com', 'User 1')`);
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user2', 'c@d.com', 'User 2')`);
        repo = new album_repository_1.AlbumRepository(db);
    });
    (0, vitest_1.afterEach)(() => {
        db.close();
    });
    (0, vitest_1.describe)("create", () => {
        (0, vitest_1.it)("creates an album and returns it with all fields", () => {
            const album = repo.create({
                id: "a1",
                userId: "user1",
                name: "Vacation",
                description: "Summer 2024",
                createdAt: "2024-06-01T00:00:00Z",
                updatedAt: "2024-06-01T00:00:00Z",
            });
            (0, vitest_1.expect)(album.id).toBe("a1");
            (0, vitest_1.expect)(album.name).toBe("Vacation");
            (0, vitest_1.expect)(album.description).toBe("Summer 2024");
            (0, vitest_1.expect)(album.userId).toBe("user1");
        });
    });
    (0, vitest_1.describe)("findById", () => {
        (0, vitest_1.it)("returns the album when found", () => {
            repo.create({
                id: "a1",
                userId: "user1",
                name: "Test",
                description: "",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            const found = repo.findById("a1");
            (0, vitest_1.expect)(found).not.toBeNull();
            (0, vitest_1.expect)(found.name).toBe("Test");
        });
        (0, vitest_1.it)("returns null when not found", () => {
            const found = repo.findById("nonexistent");
            (0, vitest_1.expect)(found).toBeNull();
        });
    });
    (0, vitest_1.describe)("update", () => {
        (0, vitest_1.it)("updates name and description", () => {
            repo.create({
                id: "a1",
                userId: "user1",
                name: "Old",
                description: "Old desc",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            const updated = repo.update("a1", {
                name: "New",
                description: "New desc",
                updatedAt: "2024-01-02T00:00:00Z",
            });
            (0, vitest_1.expect)(updated).not.toBeNull();
            (0, vitest_1.expect)(updated.name).toBe("New");
            (0, vitest_1.expect)(updated.description).toBe("New desc");
            (0, vitest_1.expect)(updated.updatedAt).toBe("2024-01-02T00:00:00Z");
        });
        (0, vitest_1.it)("returns null when album not found", () => {
            const updated = repo.update("nonexistent", {
                name: "x",
                updatedAt: "2024-01-02T00:00:00Z",
            });
            (0, vitest_1.expect)(updated).toBeNull();
        });
    });
    (0, vitest_1.describe)("delete", () => {
        (0, vitest_1.it)("deletes an album", () => {
            repo.create({
                id: "a1",
                userId: "user1",
                name: "Delete me",
                description: "",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            const deleted = repo.delete("a1");
            (0, vitest_1.expect)(deleted).toBe(true);
            (0, vitest_1.expect)(repo.findById("a1")).toBeNull();
        });
        (0, vitest_1.it)("returns false when album not found", () => {
            (0, vitest_1.expect)(repo.delete("nonexistent")).toBe(false);
        });
    });
    (0, vitest_1.describe)("listByUser", () => {
        (0, vitest_1.it)("returns albums ordered by updatedAt descending", () => {
            repo.create({ id: "a1", userId: "user1", name: "Old", description: "", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "a2", userId: "user1", name: "New", description: "", createdAt: "2024-01-02T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" });
            repo.create({ id: "a3", userId: "user1", name: "Mid", description: "", createdAt: "2024-01-03T00:00:00Z", updatedAt: "2024-03-01T00:00:00Z" });
            const result = repo.listByUser("user1", { page: 1, limit: 10 });
            (0, vitest_1.expect)(result.items).toHaveLength(3);
            (0, vitest_1.expect)(result.items[0].name).toBe("New");
            (0, vitest_1.expect)(result.items[1].name).toBe("Mid");
            (0, vitest_1.expect)(result.items[2].name).toBe("Old");
        });
        (0, vitest_1.it)("paginates results", () => {
            repo.create({ id: "a1", userId: "user1", name: "A", description: "", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-03T00:00:00Z" });
            repo.create({ id: "a2", userId: "user1", name: "B", description: "", createdAt: "2024-01-02T00:00:00Z", updatedAt: "2024-01-02T00:00:00Z" });
            repo.create({ id: "a3", userId: "user1", name: "C", description: "", createdAt: "2024-01-03T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" });
            const page1 = repo.listByUser("user1", { page: 1, limit: 2 });
            (0, vitest_1.expect)(page1.items).toHaveLength(2);
            (0, vitest_1.expect)(page1.hasMore).toBe(true);
            (0, vitest_1.expect)(page1.totalCount).toBe(3);
            const page2 = repo.listByUser("user1", { page: 2, limit: 2 });
            (0, vitest_1.expect)(page2.items).toHaveLength(1);
            (0, vitest_1.expect)(page2.hasMore).toBe(false);
        });
        (0, vitest_1.it)("returns only albums for the specified user", () => {
            repo.create({ id: "a1", userId: "user1", name: "User1 Album", description: "", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" });
            repo.create({ id: "a2", userId: "user2", name: "User2 Album", description: "", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" });
            const result = repo.listByUser("user1", { page: 1, limit: 10 });
            (0, vitest_1.expect)(result.items).toHaveLength(1);
            (0, vitest_1.expect)(result.items[0].name).toBe("User1 Album");
        });
    });
});
//# sourceMappingURL=album-repository.test.js.map