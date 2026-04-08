import { Result, NotFoundError, StorageError } from "@/common/result";
export interface StoredFile {
    key: string;
    url: string;
    sizeBytes: number;
}
export interface FileStorageAdapter {
    store(key: string, data: Buffer, contentType: string): Promise<Result<StoredFile, StorageError>>;
    retrieve(key: string): Promise<Result<Buffer, NotFoundError | StorageError>>;
    delete(key: string): Promise<Result<void, StorageError>>;
    getUrl(key: string): string;
}
export declare class LocalFileStorageAdapter implements FileStorageAdapter {
    private basePath;
    private urlPrefix;
    constructor(basePath: string, urlPrefix: string);
    store(key: string, data: Buffer, _contentType: string): Promise<Result<StoredFile, StorageError>>;
    retrieve(key: string): Promise<Result<Buffer, NotFoundError | StorageError>>;
    delete(key: string): Promise<Result<void, StorageError>>;
    getUrl(key: string): string;
}
//# sourceMappingURL=file-storage.d.ts.map