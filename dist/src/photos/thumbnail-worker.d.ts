import { Result, ProcessingError } from "@/common/result";
import { FileStorageAdapter } from "@/infrastructure/file-storage";
import { PhotoRepository } from "@/photos/photo-repository";
export interface ThumbnailJob {
    photoId: string;
    originalFileUrl: string;
}
export declare class ThumbnailWorker {
    private storage;
    private photoRepo;
    constructor(storage: FileStorageAdapter, photoRepo: PhotoRepository);
    processJob(job: ThumbnailJob): Promise<Result<void, ProcessingError>>;
}
//# sourceMappingURL=thumbnail-worker.d.ts.map