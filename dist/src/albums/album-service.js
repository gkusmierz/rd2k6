"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumService = void 0;
const uuid_1 = require("uuid");
const result_1 = require("@/common/result");
class AlbumService {
    albumRepo;
    constructor(albumRepo) {
        this.albumRepo = albumRepo;
    }
    async createAlbum(input) {
        const validationErrors = this.validateCreate(input);
        if (validationErrors)
            return (0, result_1.err)(validationErrors);
        const now = new Date().toISOString();
        const album = this.albumRepo.create({
            id: (0, uuid_1.v4)(),
            userId: input.userId,
            name: input.name.trim(),
            description: input.description ?? "",
            createdAt: now,
            updatedAt: now,
        });
        return (0, result_1.ok)(album);
    }
    async updateAlbum(albumId, input, userId) {
        const album = this.albumRepo.findById(albumId);
        if (!album)
            return (0, result_1.err)({ kind: "not_found", resource: "album", id: albumId });
        if (album.userId !== userId)
            return (0, result_1.err)({ kind: "forbidden", reason: "not owner" });
        const updated = this.albumRepo.update(albumId, {
            name: input.name,
            description: input.description,
            updatedAt: new Date().toISOString(),
        });
        return (0, result_1.ok)(updated);
    }
    async deleteAlbum(albumId, userId) {
        const album = this.albumRepo.findById(albumId);
        if (!album)
            return (0, result_1.err)({ kind: "not_found", resource: "album", id: albumId });
        if (album.userId !== userId)
            return (0, result_1.err)({ kind: "forbidden", reason: "not owner" });
        this.albumRepo.delete(albumId);
        return (0, result_1.ok)(undefined);
    }
    async listAlbums(userId, pagination) {
        const result = this.albumRepo.listByUser(userId, pagination);
        return (0, result_1.ok)(result);
    }
    async getAlbum(albumId, userId) {
        const album = this.albumRepo.findById(albumId);
        if (!album)
            return (0, result_1.err)({ kind: "not_found", resource: "album", id: albumId });
        if (album.userId !== userId)
            return (0, result_1.err)({ kind: "forbidden", reason: "not owner" });
        return (0, result_1.ok)(album);
    }
    validateCreate(input) {
        const fields = [];
        if (!input.name || input.name.trim().length === 0) {
            fields.push({ field: "name", message: "must not be empty" });
        }
        else if (input.name.length > 255) {
            fields.push({ field: "name", message: "must be at most 255 characters" });
        }
        if (input.description && input.description.length > 1000) {
            fields.push({ field: "description", message: "must be at most 1000 characters" });
        }
        return fields.length > 0 ? { kind: "validation", fields } : null;
    }
}
exports.AlbumService = AlbumService;
//# sourceMappingURL=album-service.js.map