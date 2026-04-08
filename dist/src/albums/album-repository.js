"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumRepository = void 0;
const pagination_1 = require("@/common/pagination");
function rowToAlbum(row) {
    return {
        id: row.id,
        userId: row.user_id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
class AlbumRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    create(input) {
        this.db
            .prepare(`INSERT INTO albums (id, user_id, name, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`)
            .run(input.id, input.userId, input.name, input.description, input.createdAt, input.updatedAt);
        return this.findById(input.id);
    }
    findById(id) {
        const row = this.db
            .prepare(`SELECT * FROM albums WHERE id = ?`)
            .get(id);
        return row ? rowToAlbum(row) : null;
    }
    update(id, fields) {
        const existing = this.findById(id);
        if (!existing)
            return null;
        const name = fields.name ?? existing.name;
        const description = fields.description ?? existing.description;
        this.db
            .prepare(`UPDATE albums SET name = ?, description = ?, updated_at = ? WHERE id = ?`)
            .run(name, description, fields.updatedAt, id);
        return this.findById(id);
    }
    delete(id) {
        const result = this.db.prepare(`DELETE FROM albums WHERE id = ?`).run(id);
        return result.changes > 0;
    }
    listByUser(userId, pagination) {
        const countRow = this.db
            .prepare(`SELECT COUNT(*) as cnt FROM albums WHERE user_id = ?`)
            .get(userId);
        const totalCount = countRow.cnt;
        const offset = (pagination.page - 1) * pagination.limit;
        const rows = this.db
            .prepare(`SELECT * FROM albums WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?`)
            .all(userId, pagination.limit, offset);
        return (0, pagination_1.paginate)(rows.map(rowToAlbum), totalCount, pagination);
    }
}
exports.AlbumRepository = AlbumRepository;
//# sourceMappingURL=album-repository.js.map