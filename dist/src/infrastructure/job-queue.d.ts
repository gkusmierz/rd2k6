export type JobHandler = (data: any, attempt: number) => Promise<void>;
export interface JobFailure {
    jobType: string;
    data: any;
    error: Error;
}
interface JobQueueOptions {
    maxRetries: number;
}
export interface JobQueue {
    registerHandler(jobType: string, handler: JobHandler): void;
    enqueue(jobType: string, data: any): Promise<void>;
    processAll(): Promise<JobFailure[]>;
    pendingCount(): number;
}
export declare class InProcessJobQueue implements JobQueue {
    private handlers;
    private queue;
    private maxRetries;
    constructor(options: JobQueueOptions);
    registerHandler(jobType: string, handler: JobHandler): void;
    enqueue(jobType: string, data: any): Promise<void>;
    processAll(): Promise<JobFailure[]>;
    pendingCount(): number;
}
export {};
//# sourceMappingURL=job-queue.d.ts.map