import Database from "better-sqlite3";
import { PaginationInput, PaginatedList } from "@/common/pagination";
export interface Photo {
    id: string;
    albumId: string;
    userId: string;
    originalUrl: string;
    thumbnailUrl: string | null;
    thumbnailStatus: string;
    originalName: string;
    sizeBytes: number;
    mimeType: string;
    uploadedAt: string;
}
export interface PhotoNavigation {
    photo: Photo;
    previousPhotoId: string | null;
    nextPhotoId: string | null;
}
interface CreatePhotoInput {
    id: string;
    albumId: string;
    userId: string;
    originalUrl: string;
    thumbnailUrl: string | null;
    thumbnailStatus: string;
    originalName: string;
    sizeBytes: number;
    mimeType: string;
    uploadedAt: string;
}
export declare class PhotoRepository {
    private db;
    constructor(db: Database.Database);
    create(input: CreatePhotoInput): Photo;
    findById(id: string): Photo | null;
    listByAlbum(albumId: string, pagination: PaginationInput): PaginatedList<Photo>;
    getWithNavigation(photoId: string): PhotoNavigation | null;
    updateThumbnail(photoId: string, thumbnailUrl: string, thumbnailStatus: string): void;
    delete(id: string): boolean;
    deleteByAlbum(albumId: string): number;
    listByIds(ids: string[]): Photo[];
}
export {};
//# sourceMappingURL=photo-repository.d.ts.map