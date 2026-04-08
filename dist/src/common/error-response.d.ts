import { Response } from "express";
export interface ErrorResponse {
    error: {
        code: string;
        message: string;
        details?: {
            field: string;
            message: string;
        }[];
        correlationId: string;
    };
}
export declare function sendError(res: Response, statusCode: number, code: string, message: string, details?: {
    field: string;
    message: string;
}[]): void;
export declare function mapServiceError(res: Response, error: {
    kind: string;
    [key: string]: any;
}): void;
//# sourceMappingURL=error-response.d.ts.map