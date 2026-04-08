import { Result, ValidationError, NotFoundError, ForbiddenError } from "@/common/result";
import { PaginationInput, PaginatedList } from "@/common/pagination";
import { PhotoRepository, Photo } from "@/photos/photo-repository";
import { AlbumRepository } from "@/albums/album-repository";
import { FileStorageAdapter } from "@/infrastructure/file-storage";
import { JobQueue } from "@/infrastructure/job-queue";
export interface UploadedFile {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
}
export interface PhotoDetail extends Photo {
    fullSizeUrl: string;
    albumName: string;
    nextPhotoId: string | null;
    previousPhotoId: string | null;
    tags: string[];
}
export declare class PhotoService {
    private photoRepo;
    private albumRepo;
    private storage;
    private jobQueue;
    constructor(photoRepo: PhotoRepository, albumRepo: AlbumRepository, storage: FileStorageAdapter, jobQueue: JobQueue);
    uploadPhoto(albumId: string, file: UploadedFile, userId: string): Promise<Result<Photo, ValidationError | NotFoundError | ForbiddenError>>;
    getPhoto(photoId: string, userId: string): Promise<Result<PhotoDetail, NotFoundError | ForbiddenError>>;
    listPhotos(albumId: string, userId: string, pagination: PaginationInput): Promise<Result<PaginatedList<Photo>, NotFoundError | ForbiddenError>>;
    deletePhoto(photoId: string, userId: string): Promise<Result<void, NotFoundError | ForbiddenError>>;
    private getTagsForPhoto;
}
//# sourceMappingURL=photo-service.d.ts.map