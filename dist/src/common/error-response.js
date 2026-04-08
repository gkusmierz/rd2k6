"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = sendError;
exports.mapServiceError = mapServiceError;
const uuid_1 = require("uuid");
function sendError(res, statusCode, code, message, details) {
    const response = {
        error: {
            code,
            message,
            correlationId: (0, uuid_1.v4)(),
            ...(details && { details }),
        },
    };
    res.status(statusCode).json(response);
}
function mapServiceError(res, error) {
    switch (error.kind) {
        case "validation":
            sendError(res, 400, "VALIDATION_ERROR", "Validation failed", error.fields);
            break;
        case "not_found":
            sendError(res, 404, "NOT_FOUND", `${error.resource} not found`);
            break;
        case "forbidden":
            sendError(res, 403, "FORBIDDEN", error.reason);
            break;
        case "storage":
            sendError(res, 500, "STORAGE_ERROR", error.message);
            break;
        default:
            sendError(res, 500, "INTERNAL_ERROR", "An unexpected error occurred");
    }
}
//# sourceMappingURL=error-response.js.map