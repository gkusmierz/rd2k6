import { Result, ValidationError, NotFoundError, ForbiddenError } from "@/common/result";
import { PaginationInput, PaginatedList } from "@/common/pagination";
import { AlbumRepository, Album } from "@/albums/album-repository";
export interface CreateAlbumInput {
    name: string;
    description?: string;
    userId: string;
}
export interface UpdateAlbumInput {
    name?: string;
    description?: string;
}
export declare class AlbumService {
    private albumRepo;
    constructor(albumRepo: AlbumRepository);
    createAlbum(input: CreateAlbumInput): Promise<Result<Album, ValidationError>>;
    updateAlbum(albumId: string, input: UpdateAlbumInput, userId: string): Promise<Result<Album, NotFoundError | ForbiddenError>>;
    deleteAlbum(albumId: string, userId: string): Promise<Result<void, NotFoundError | ForbiddenError>>;
    listAlbums(userId: string, pagination: PaginationInput): Promise<Result<PaginatedList<Album>, never>>;
    getAlbum(albumId: string, userId: string): Promise<Result<Album, NotFoundError | ForbiddenError>>;
    private validateCreate;
}
//# sourceMappingURL=album-service.d.ts.map