"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlbumRouter = createAlbumRouter;
const express_1 = require("express");
const error_response_1 = require("@/common/error-response");
function createAlbumRouter(service) {
    const router = (0, express_1.Router)();
    // POST /api/albums
    router.post("/", async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            (0, error_response_1.sendError)(res, 401, "UNAUTHORIZED", "Authentication required");
            return;
        }
        const result = await service.createAlbum({
            name: req.body.name,
            description: req.body.description,
            userId,
        });
        if (result.success) {
            res.status(201).json(result.data);
        }
        else {
            (0, error_response_1.mapServiceError)(res, result.error);
        }
    });
    // GET /api/albums
    router.get("/", async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            (0, error_response_1.sendError)(res, 401, "UNAUTHORIZED", "Authentication required");
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const result = await service.listAlbums(userId, { page, limit });
        if (result.success) {
            res.json(result.data);
        }
    });
    // GET /api/albums/:id
    router.get("/:id", async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            (0, error_response_1.sendError)(res, 401, "UNAUTHORIZED", "Authentication required");
            return;
        }
        const result = await service.getAlbum(req.params.id, userId);
        if (result.success) {
            res.json(result.data);
        }
        else {
            (0, error_response_1.mapServiceError)(res, result.error);
        }
    });
    // PUT /api/albums/:id
    router.put("/:id", async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            (0, error_response_1.sendError)(res, 401, "UNAUTHORIZED", "Authentication required");
            return;
        }
        const result = await service.updateAlbum(req.params.id, { name: req.body.name, description: req.body.description }, userId);
        if (result.success) {
            res.json(result.data);
        }
        else {
            (0, error_response_1.mapServiceError)(res, result.error);
        }
    });
    // DELETE /api/albums/:id
    router.delete("/:id", async (req, res) => {
        const userId = req.userId;
        if (!userId) {
            (0, error_response_1.sendError)(res, 401, "UNAUTHORIZED", "Authentication required");
            return;
        }
        const result = await service.deleteAlbum(req.params.id, userId);
        if (result.success) {
            res.status(204).send();
        }
        else {
            (0, error_response_1.mapServiceError)(res, result.error);
        }
    });
    return router;
}
//# sourceMappingURL=album-controller.js.map