"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const database_1 = require("@/common/database");
const photo_repository_1 = require("@/photos/photo-repository");
const album_repository_1 = require("@/albums/album-repository");
const photo_service_1 = require("@/photos/photo-service");
const file_storage_1 = require("@/infrastructure/file-storage");
const job_queue_1 = require("@/infrastructure/job-queue");
// JPEG magic bytes: FF D8 FF
const JPEG_HEADER = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
// PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
// WebP: RIFF....WEBP
const WEBP_HEADER = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x00, 0x00, 0x00, 0x00, // size
    0x57, 0x45, 0x42, 0x50, // WEBP
]);
function makeFileBuffer(header, totalSize = 100) {
    const padding = Buffer.alloc(totalSize - header.length);
    return Buffer.concat([header, padding]);
}
(0, vitest_1.describe)("PhotoService", () => {
    let db;
    let photoRepo;
    let albumRepo;
    let service;
    let tmpDir;
    let jobQueue;
    (0, vitest_1.beforeEach)(() => {
        db = (0, database_1.createTestDatabase)();
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user1', 'a@b.com', 'User 1')`);
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user2', 'c@d.com', 'User 2')`);
        albumRepo = new album_repository_1.AlbumRepository(db);
        albumRepo.create({
            id: "album1", userId: "user1", name: "Test Album", description: "",
            createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z",
        });
        photoRepo = new photo_repository_1.PhotoRepository(db);
        tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), "photo-svc-"));
        const storage = new file_storage_1.LocalFileStorageAdapter(tmpDir, "/files");
        jobQueue = new job_queue_1.InProcessJobQueue({ maxRetries: 3 });
        service = new photo_service_1.PhotoService(photoRepo, albumRepo, storage, jobQueue);
    });
    (0, vitest_1.afterEach)(() => {
        db.close();
        fs_1.default.rmSync(tmpDir, { recursive: true, force: true });
    });
    (0, vitest_1.describe)("uploadPhoto", () => {
        (0, vitest_1.it)("uploads a JPEG photo successfully", async () => {
            const result = await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 200),
                originalName: "photo.jpg",
                mimeType: "image/jpeg",
                sizeBytes: 200,
            }, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.albumId).toBe("album1");
                (0, vitest_1.expect)(result.data.thumbnailStatus).toBe("pending");
                (0, vitest_1.expect)(result.data.mimeType).toBe("image/jpeg");
            }
        });
        (0, vitest_1.it)("uploads a PNG photo successfully", async () => {
            const result = await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(PNG_HEADER, 200),
                originalName: "photo.png",
                mimeType: "image/png",
                sizeBytes: 200,
            }, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)("uploads a WebP photo successfully", async () => {
            const result = await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(WEBP_HEADER, 200),
                originalName: "photo.webp",
                mimeType: "image/webp",
                sizeBytes: 200,
            }, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)("rejects unsupported format (validates magic bytes)", async () => {
            const result = await service.uploadPhoto("album1", {
                buffer: Buffer.from("this is a text file"),
                originalName: "readme.txt",
                mimeType: "text/plain",
                sizeBytes: 19,
            }, "user1");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("validation");
            }
        });
        (0, vitest_1.it)("rejects file with wrong magic bytes even if mimeType claims JPEG", async () => {
            const result = await service.uploadPhoto("album1", {
                buffer: Buffer.from("not a real jpeg"),
                originalName: "fake.jpg",
                mimeType: "image/jpeg",
                sizeBytes: 15,
            }, "user1");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("validation");
            }
        });
        (0, vitest_1.it)("returns not_found for nonexistent album", async () => {
            const result = await service.uploadPhoto("nonexistent", {
                buffer: makeFileBuffer(JPEG_HEADER, 200),
                originalName: "photo.jpg",
                mimeType: "image/jpeg",
                sizeBytes: 200,
            }, "user1");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("not_found");
            }
        });
        (0, vitest_1.it)("returns forbidden when user does not own the album", async () => {
            const result = await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 200),
                originalName: "photo.jpg",
                mimeType: "image/jpeg",
                sizeBytes: 200,
            }, "user2");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("forbidden");
            }
        });
        (0, vitest_1.it)("rejects files exceeding max size", async () => {
            const bigBuffer = makeFileBuffer(JPEG_HEADER, 21 * 1024 * 1024);
            const result = await service.uploadPhoto("album1", {
                buffer: bigBuffer,
                originalName: "huge.jpg",
                mimeType: "image/jpeg",
                sizeBytes: bigBuffer.length,
            }, "user1");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("validation");
            }
        });
        (0, vitest_1.it)("enqueues a thumbnail job after upload", async () => {
            await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 200),
                originalName: "photo.jpg",
                mimeType: "image/jpeg",
                sizeBytes: 200,
            }, "user1");
            (0, vitest_1.expect)(jobQueue.pendingCount()).toBe(1);
        });
    });
    (0, vitest_1.describe)("getPhoto", () => {
        (0, vitest_1.it)("returns photo detail with navigation", async () => {
            await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 100),
                originalName: "a.jpg", mimeType: "image/jpeg", sizeBytes: 100,
            }, "user1");
            await new Promise(r => setTimeout(r, 10));
            const upload2 = await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 100),
                originalName: "b.jpg", mimeType: "image/jpeg", sizeBytes: 100,
            }, "user1");
            if (!upload2.success)
                throw new Error("setup failed");
            const result = await service.getPhoto(upload2.data.id, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.previousPhotoId).not.toBeNull();
                (0, vitest_1.expect)(result.data.nextPhotoId).toBeNull();
                (0, vitest_1.expect)(result.data.albumName).toBe("Test Album");
            }
        });
        (0, vitest_1.it)("returns forbidden for non-owner", async () => {
            const upload = await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 100),
                originalName: "a.jpg", mimeType: "image/jpeg", sizeBytes: 100,
            }, "user1");
            if (!upload.success)
                throw new Error("setup failed");
            const result = await service.getPhoto(upload.data.id, "user2");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
    (0, vitest_1.describe)("listPhotos", () => {
        (0, vitest_1.it)("returns paginated photos for an album", async () => {
            await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 100),
                originalName: "a.jpg", mimeType: "image/jpeg", sizeBytes: 100,
            }, "user1");
            const result = await service.listPhotos("album1", "user1", { page: 1, limit: 10 });
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.items).toHaveLength(1);
            }
        });
    });
    (0, vitest_1.describe)("deletePhoto", () => {
        (0, vitest_1.it)("deletes a photo", async () => {
            const upload = await service.uploadPhoto("album1", {
                buffer: makeFileBuffer(JPEG_HEADER, 100),
                originalName: "del.jpg", mimeType: "image/jpeg", sizeBytes: 100,
            }, "user1");
            if (!upload.success)
                throw new Error("setup failed");
            const result = await service.deletePhoto(upload.data.id, "user1");
            (0, vitest_1.expect)(result.success).toBe(true);
            const get = await service.getPhoto(upload.data.id, "user1");
            (0, vitest_1.expect)(get.success).toBe(false);
        });
    });
});
//# sourceMappingURL=photo-service.test.js.map