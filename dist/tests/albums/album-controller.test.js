"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("@/common/database");
const album_repository_1 = require("@/albums/album-repository");
const album_service_1 = require("@/albums/album-service");
const album_controller_1 = require("@/albums/album-controller");
(0, vitest_1.describe)("AlbumController", () => {
    let db;
    let app;
    (0, vitest_1.beforeEach)(() => {
        db = (0, database_1.createTestDatabase)();
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user1', 'a@b.com', 'User 1')`);
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user2', 'c@d.com', 'User 2')`);
        const repo = new album_repository_1.AlbumRepository(db);
        const service = new album_service_1.AlbumService(repo);
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Simulate auth middleware: x-user-id header
        app.use((req, _res, next) => {
            req.userId = req.headers["x-user-id"];
            next();
        });
        app.use("/api/albums", (0, album_controller_1.createAlbumRouter)(service));
    });
    (0, vitest_1.afterEach)(() => {
        db.close();
    });
    (0, vitest_1.describe)("POST /api/albums", () => {
        (0, vitest_1.it)("creates an album and returns 201", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/api/albums")
                .set("x-user-id", "user1")
                .send({ name: "My Album", description: "Desc" });
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body.name).toBe("My Album");
            (0, vitest_1.expect)(res.body.id).toBeTruthy();
        });
        (0, vitest_1.it)("returns 400 for empty name", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/api/albums")
                .set("x-user-id", "user1")
                .send({ name: "" });
            (0, vitest_1.expect)(res.status).toBe(400);
            (0, vitest_1.expect)(res.body.error.code).toBe("VALIDATION_ERROR");
            (0, vitest_1.expect)(res.body.error.details).toBeDefined();
        });
        (0, vitest_1.it)("returns 401 when no user id", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/api/albums")
                .send({ name: "Test" });
            (0, vitest_1.expect)(res.status).toBe(401);
        });
    });
    (0, vitest_1.describe)("GET /api/albums", () => {
        (0, vitest_1.it)("lists user albums", async () => {
            await (0, supertest_1.default)(app).post("/api/albums").set("x-user-id", "user1").send({ name: "A1" });
            await (0, supertest_1.default)(app).post("/api/albums").set("x-user-id", "user1").send({ name: "A2" });
            const res = await (0, supertest_1.default)(app).get("/api/albums").set("x-user-id", "user1");
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.items).toHaveLength(2);
            (0, vitest_1.expect)(res.body.totalCount).toBe(2);
        });
        (0, vitest_1.it)("supports pagination params", async () => {
            await (0, supertest_1.default)(app).post("/api/albums").set("x-user-id", "user1").send({ name: "A1" });
            await (0, supertest_1.default)(app).post("/api/albums").set("x-user-id", "user1").send({ name: "A2" });
            await (0, supertest_1.default)(app).post("/api/albums").set("x-user-id", "user1").send({ name: "A3" });
            const res = await (0, supertest_1.default)(app)
                .get("/api/albums?page=1&limit=2")
                .set("x-user-id", "user1");
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.items).toHaveLength(2);
            (0, vitest_1.expect)(res.body.hasMore).toBe(true);
        });
    });
    (0, vitest_1.describe)("GET /api/albums/:id", () => {
        (0, vitest_1.it)("returns the album", async () => {
            const created = await (0, supertest_1.default)(app)
                .post("/api/albums")
                .set("x-user-id", "user1")
                .send({ name: "Get Me" });
            const res = await (0, supertest_1.default)(app)
                .get(`/api/albums/${created.body.id}`)
                .set("x-user-id", "user1");
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.name).toBe("Get Me");
        });
        (0, vitest_1.it)("returns 404 for nonexistent", async () => {
            const res = await (0, supertest_1.default)(app).get("/api/albums/bad").set("x-user-id", "user1");
            (0, vitest_1.expect)(res.status).toBe(404);
        });
        (0, vitest_1.it)("returns 403 for non-owner", async () => {
            const created = await (0, supertest_1.default)(app)
                .post("/api/albums")
                .set("x-user-id", "user1")
                .send({ name: "Private" });
            const res = await (0, supertest_1.default)(app)
                .get(`/api/albums/${created.body.id}`)
                .set("x-user-id", "user2");
            (0, vitest_1.expect)(res.status).toBe(403);
        });
    });
    (0, vitest_1.describe)("PUT /api/albums/:id", () => {
        (0, vitest_1.it)("updates the album", async () => {
            const created = await (0, supertest_1.default)(app)
                .post("/api/albums")
                .set("x-user-id", "user1")
                .send({ name: "Old" });
            const res = await (0, supertest_1.default)(app)
                .put(`/api/albums/${created.body.id}`)
                .set("x-user-id", "user1")
                .send({ name: "New" });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.name).toBe("New");
        });
    });
    (0, vitest_1.describe)("DELETE /api/albums/:id", () => {
        (0, vitest_1.it)("deletes the album and returns 204", async () => {
            const created = await (0, supertest_1.default)(app)
                .post("/api/albums")
                .set("x-user-id", "user1")
                .send({ name: "Bye" });
            const res = await (0, supertest_1.default)(app)
                .delete(`/api/albums/${created.body.id}`)
                .set("x-user-id", "user1");
            (0, vitest_1.expect)(res.status).toBe(204);
        });
    });
});
//# sourceMappingURL=album-controller.test.js.map