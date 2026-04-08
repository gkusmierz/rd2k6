"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoRepository = void 0;
const pagination_1 = require("@/common/pagination");
function rowToPhoto(row) {
    return {
        id: row.id,
        albumId: row.album_id,
        userId: row.user_id,
        originalUrl: row.original_url,
        thumbnailUrl: row.thumbnail_url,
        thumbnailStatus: row.thumbnail_status,
        originalName: row.original_name,
        sizeBytes: row.size_bytes,
        mimeType: row.mime_type,
        uploadedAt: row.uploaded_at,
    };
}
class PhotoRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    create(input) {
        this.db
            .prepare(`INSERT INTO photos (id, album_id, user_id, original_url, thumbnail_url, thumbnail_status, original_name, size_bytes, mime_type, uploaded_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(input.id, input.albumId, input.userId, input.originalUrl, input.thumbnailUrl, input.thumbnailStatus, input.originalName, input.sizeBytes, input.mimeType, input.uploadedAt);
        return this.findById(input.id);
    }
    findById(id) {
        const row = this.db.prepare(`SELECT * FROM photos WHERE id = ?`).get(id);
        return row ? rowToPhoto(row) : null;
    }
    listByAlbum(albumId, pagination) {
        const countRow = this.db
            .prepare(`SELECT COUNT(*) as cnt FROM photos WHERE album_id = ?`)
            .get(albumId);
        const offset = (pagination.page - 1) * pagination.limit;
        const rows = this.db
            .prepare(`SELECT * FROM photos WHERE album_id = ? ORDER BY uploaded_at ASC LIMIT ? OFFSET ?`)
            .all(albumId, pagination.limit, offset);
        return (0, pagination_1.paginate)(rows.map(rowToPhoto), countRow.cnt, pagination);
    }
    getWithNavigation(photoId) {
        const photo = this.findById(photoId);
        if (!photo)
            return null;
        const prev = this.db
            .prepare(`SELECT id FROM photos WHERE album_id = ? AND uploaded_at < ? ORDER BY uploaded_at DESC LIMIT 1`)
            .get(photo.albumId, photo.uploadedAt);
        const next = this.db
            .prepare(`SELECT id FROM photos WHERE album_id = ? AND uploaded_at > ? ORDER BY uploaded_at ASC LIMIT 1`)
            .get(photo.albumId, photo.uploadedAt);
        return {
            photo,
            previousPhotoId: prev?.id ?? null,
            nextPhotoId: next?.id ?? null,
        };
    }
    updateThumbnail(photoId, thumbnailUrl, thumbnailStatus) {
        this.db
            .prepare(`UPDATE photos SET thumbnail_url = ?, thumbnail_status = ? WHERE id = ?`)
            .run(thumbnailUrl, thumbnailStatus, photoId);
    }
    delete(id) {
        const result = this.db.prepare(`DELETE FROM photos WHERE id = ?`).run(id);
        return result.changes > 0;
    }
    deleteByAlbum(albumId) {
        const result = this.db.prepare(`DELETE FROM photos WHERE album_id = ?`).run(albumId);
        return result.changes;
    }
    listByIds(ids) {
        if (ids.length === 0)
            return [];
        const placeholders = ids.map(() => "?").join(",");
        const rows = this.db
            .prepare(`SELECT * FROM photos WHERE id IN (${placeholders})`)
            .all(...ids);
        return rows.map(rowToPhoto);
    }
}
exports.PhotoRepository = PhotoRepository;
//# sourceMappingURL=photo-repository.js.map