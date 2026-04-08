import Database from "better-sqlite3";
import { PaginationInput, PaginatedList } from "@/common/pagination";
export interface Album {
    id: string;
    userId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
interface CreateAlbumRow {
    id: string;
    userId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
interface UpdateAlbumFields {
    name?: string;
    description?: string;
    updatedAt: string;
}
export declare class AlbumRepository {
    private db;
    constructor(db: Database.Database);
    create(input: CreateAlbumRow): Album;
    findById(id: string): Album | null;
    update(id: string, fields: UpdateAlbumFields): Album | null;
    delete(id: string): boolean;
    listByUser(userId: string, pagination: PaginationInput): PaginatedList<Album>;
}
export {};
//# sourceMappingURL=album-repository.d.ts.map