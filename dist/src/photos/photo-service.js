"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoService = void 0;
const uuid_1 = require("uuid");
const result_1 = require("@/common/result");
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAGIC_BYTES = {
    "image/jpeg": [{ bytes: [0xFF, 0xD8, 0xFF], offset: 0 }],
    "image/png": [{ bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], offset: 0 }],
    "image/webp": [
        { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
        { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
    ],
};
function detectFormat(buffer) {
    for (const [format, signatures] of Object.entries(MAGIC_BYTES)) {
        const matches = signatures.every((sig) => sig.bytes.every((byte, i) => buffer[sig.offset + i] === byte));
        if (matches)
            return format;
    }
    return null;
}
class PhotoService {
    photoRepo;
    albumRepo;
    storage;
    jobQueue;
    constructor(photoRepo, albumRepo, storage, jobQueue) {
        this.photoRepo = photoRepo;
        this.albumRepo = albumRepo;
        this.storage = storage;
        this.jobQueue = jobQueue;
    }
    async uploadPhoto(albumId, file, userId) {
        // Check album
        const album = this.albumRepo.findById(albumId);
        if (!album)
            return (0, result_1.err)({ kind: "not_found", resource: "album", id: albumId });
        if (album.userId !== userId)
            return (0, result_1.err)({ kind: "forbidden", reason: "not owner" });
        // Validate size
        if (file.buffer.length > MAX_FILE_SIZE) {
            return (0, result_1.err)({
                kind: "validation",
                fields: [{ field: "file", message: `File exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)} MB` }],
            });
        }
        // Validate format via magic bytes
        const format = detectFormat(file.buffer);
        if (!format) {
            return (0, result_1.err)({
                kind: "validation",
                fields: [{ field: "file", message: "Unsupported format. Allowed: JPEG, PNG, WebP" }],
            });
        }
        // Store file
        const photoId = (0, uuid_1.v4)();
        const ext = format.split("/")[1];
        const storageKey = `originals/${photoId}.${ext}`;
        const storeResult = await this.storage.store(storageKey, file.buffer, format);
        if (!storeResult.success) {
            return (0, result_1.err)({ kind: "validation", fields: [{ field: "file", message: "Failed to store file" }] });
        }
        // Create record
        const photo = this.photoRepo.create({
            id: photoId,
            albumId,
            userId,
            originalUrl: storeResult.data.url,
            thumbnailUrl: null,
            thumbnailStatus: "pending",
            originalName: file.originalName,
            sizeBytes: file.buffer.length,
            mimeType: format,
            uploadedAt: new Date().toISOString(),
        });
        // Enqueue thumbnail job
        await this.jobQueue.enqueue("thumbnail", {
            photoId: photo.id,
            originalFileUrl: storeResult.data.key,
        });
        return (0, result_1.ok)(photo);
    }
    async getPhoto(photoId, userId) {
        const nav = this.photoRepo.getWithNavigation(photoId);
        if (!nav)
            return (0, result_1.err)({ kind: "not_found", resource: "photo", id: photoId });
        const photo = nav.photo;
        if (photo.userId !== userId) {
            return (0, result_1.err)({ kind: "forbidden", reason: "not owner" });
        }
        const album = this.albumRepo.findById(photo.albumId);
        // Get tags
        const tagRows = this.getTagsForPhoto(photoId);
        return (0, result_1.ok)({
            ...photo,
            fullSizeUrl: photo.originalUrl,
            albumName: album?.name ?? "",
            nextPhotoId: nav.nextPhotoId,
            previousPhotoId: nav.previousPhotoId,
            tags: tagRows,
        });
    }
    async listPhotos(albumId, userId, pagination) {
        const album = this.albumRepo.findById(albumId);
        if (!album)
            return (0, result_1.err)({ kind: "not_found", resource: "album", id: albumId });
        if (album.userId !== userId)
            return (0, result_1.err)({ kind: "forbidden", reason: "not owner" });
        return (0, result_1.ok)(this.photoRepo.listByAlbum(albumId, pagination));
    }
    async deletePhoto(photoId, userId) {
        const photo = this.photoRepo.findById(photoId);
        if (!photo)
            return (0, result_1.err)({ kind: "not_found", resource: "photo", id: photoId });
        if (photo.userId !== userId)
            return (0, result_1.err)({ kind: "forbidden", reason: "not owner" });
        this.photoRepo.delete(photoId);
        return (0, result_1.ok)(undefined);
    }
    getTagsForPhoto(photoId) {
        // This will be used by TagService but we need basic support here
        return [];
    }
}
exports.PhotoService = PhotoService;
//# sourceMappingURL=photo-service.js.map