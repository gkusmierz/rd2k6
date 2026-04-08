"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const thumbnail_worker_1 = require("@/photos/thumbnail-worker");
const file_storage_1 = require("@/infrastructure/file-storage");
// Minimal valid JPEG (smallest possible valid JPEG)
function createMinimalJpeg() {
    // Create a small file that sharp can process - 1x1 red pixel JPEG
    // This is a known minimal valid JPEG
    return Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
        0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
        0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
        0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
        0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
        0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
        0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
        0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
        0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
        0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
        0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
        0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
        0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
        0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
        0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
        0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
        0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
        0x00, 0x00, 0x3F, 0x00, 0x7B, 0x94, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xD9,
    ]);
}
(0, vitest_1.describe)("ThumbnailWorker", () => {
    let db;
    let photoRepo;
    let storage;
    let worker;
    let tmpDir;
    (0, vitest_1.beforeEach)(() => {
        db = (0, database_1.createTestDatabase)();
        db.exec(`INSERT INTO users (id, email, display_name) VALUES ('user1', 'a@b.com', 'User 1')`);
        db.exec(`INSERT INTO albums (id, user_id, name, description, created_at, updated_at)
             VALUES ('album1', 'user1', 'Test Album', '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')`);
        photoRepo = new photo_repository_1.PhotoRepository(db);
        tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), "thumb-test-"));
        storage = new file_storage_1.LocalFileStorageAdapter(tmpDir, "/files");
        worker = new thumbnail_worker_1.ThumbnailWorker(storage, photoRepo);
    });
    (0, vitest_1.afterEach)(() => {
        db.close();
        fs_1.default.rmSync(tmpDir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("generates a thumbnail and updates the photo record", async () => {
        // Store original image using sharp to create a valid image
        const sharp = (await Promise.resolve().then(() => __importStar(require("sharp")))).default;
        const validImage = await sharp({
            create: { width: 800, height: 600, channels: 3, background: { r: 255, g: 0, b: 0 } },
        }).jpeg().toBuffer();
        await storage.store("originals/p1.jpeg", validImage, "image/jpeg");
        photoRepo.create({
            id: "p1", albumId: "album1", userId: "user1",
            originalUrl: "/files/originals/p1.jpeg", thumbnailUrl: null,
            thumbnailStatus: "pending", originalName: "photo.jpg",
            sizeBytes: validImage.length, mimeType: "image/jpeg",
            uploadedAt: "2024-01-01T00:00:00Z",
        });
        const result = await worker.processJob({
            photoId: "p1",
            originalFileUrl: "originals/p1.jpeg",
        });
        (0, vitest_1.expect)(result.success).toBe(true);
        const photo = photoRepo.findById("p1");
        (0, vitest_1.expect)(photo.thumbnailStatus).toBe("ready");
        (0, vitest_1.expect)(photo.thumbnailUrl).toContain("thumbnails/p1");
    });
    (0, vitest_1.it)("marks photo as failed when original file is missing", async () => {
        photoRepo.create({
            id: "p2", albumId: "album1", userId: "user1",
            originalUrl: "/files/missing.jpg", thumbnailUrl: null,
            thumbnailStatus: "pending", originalName: "missing.jpg",
            sizeBytes: 100, mimeType: "image/jpeg",
            uploadedAt: "2024-01-01T00:00:00Z",
        });
        const result = await worker.processJob({
            photoId: "p2",
            originalFileUrl: "missing.jpg",
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
});
//# sourceMappingURL=thumbnail-worker.test.js.map