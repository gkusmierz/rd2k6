"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThumbnailWorker = void 0;
const sharp_1 = __importDefault(require("sharp"));
const result_1 = require("@/common/result");
const THUMBNAIL_SIZE = 300;
class ThumbnailWorker {
    storage;
    photoRepo;
    constructor(storage, photoRepo) {
        this.storage = storage;
        this.photoRepo = photoRepo;
    }
    async processJob(job) {
        try {
            // Fetch original
            const fetchResult = await this.storage.retrieve(job.originalFileUrl);
            if (!fetchResult.success) {
                return (0, result_1.err)({
                    kind: "processing",
                    message: `Original file not found: ${job.originalFileUrl}`,
                    retryable: false,
                });
            }
            // Generate thumbnail
            const thumbnail = await (0, sharp_1.default)(fetchResult.data)
                .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toBuffer();
            // Store thumbnail
            const thumbnailKey = `thumbnails/${job.photoId}.jpg`;
            const storeResult = await this.storage.store(thumbnailKey, thumbnail, "image/jpeg");
            if (!storeResult.success) {
                return (0, result_1.err)({
                    kind: "processing",
                    message: "Failed to store thumbnail",
                    retryable: true,
                });
            }
            // Update photo record
            this.photoRepo.updateThumbnail(job.photoId, storeResult.data.url, "ready");
            return (0, result_1.ok)(undefined);
        }
        catch (e) {
            return (0, result_1.err)({
                kind: "processing",
                message: e.message,
                retryable: true,
            });
        }
    }
}
exports.ThumbnailWorker = ThumbnailWorker;
//# sourceMappingURL=thumbnail-worker.js.map