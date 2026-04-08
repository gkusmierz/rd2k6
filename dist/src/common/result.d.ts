export interface FieldError {
    field: string;
    message: string;
}
export interface ValidationError {
    kind: "validation";
    fields: FieldError[];
}
export interface NotFoundError {
    kind: "not_found";
    resource: string;
    id: string;
}
export interface ForbiddenError {
    kind: "forbidden";
    reason: string;
}
export interface StorageError {
    kind: "storage";
    message: string;
}
export interface ProcessingError {
    kind: "processing";
    message: string;
    retryable: boolean;
}
export type Result<T, E> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
export declare function ok<T>(data: T): Result<T, never>;
export declare function err<E>(error: E): Result<never, E>;
export declare function isOk<T, E>(result: Result<T, E>): result is {
    success: true;
    data: T;
};
export declare function isErr<T, E>(result: Result<T, E>): result is {
    success: false;
    error: E;
};
//# sourceMappingURL=result.d.ts.map