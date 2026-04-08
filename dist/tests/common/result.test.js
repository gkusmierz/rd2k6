"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const result_1 = require("@/common/result");
const pagination_1 = require("@/common/pagination");
(0, vitest_1.describe)("Result type utilities", () => {
    (0, vitest_1.it)("ok() creates a success result", () => {
        const result = (0, result_1.ok)(42);
        (0, vitest_1.expect)(result.success).toBe(true);
        if (result.success) {
            (0, vitest_1.expect)(result.data).toBe(42);
        }
    });
    (0, vitest_1.it)("err() creates a failure result", () => {
        const error = {
            kind: "validation",
            fields: [{ field: "name", message: "required" }],
        };
        const result = (0, result_1.err)(error);
        (0, vitest_1.expect)(result.success).toBe(false);
        if (!result.success) {
            (0, vitest_1.expect)(result.error.kind).toBe("validation");
            (0, vitest_1.expect)(result.error.fields).toHaveLength(1);
        }
    });
    (0, vitest_1.it)("isOk() returns true for success results", () => {
        (0, vitest_1.expect)((0, result_1.isOk)((0, result_1.ok)("hello"))).toBe(true);
        (0, vitest_1.expect)((0, result_1.isOk)((0, result_1.err)({ kind: "not_found", resource: "x", id: "1" }))).toBe(false);
    });
    (0, vitest_1.it)("isErr() returns true for error results", () => {
        (0, vitest_1.expect)((0, result_1.isErr)((0, result_1.err)({ kind: "not_found", resource: "x", id: "1" }))).toBe(true);
        (0, vitest_1.expect)((0, result_1.isErr)((0, result_1.ok)("hello"))).toBe(false);
    });
});
(0, vitest_1.describe)("Error types", () => {
    (0, vitest_1.it)("ValidationError has kind 'validation' and fields array", () => {
        const e = {
            kind: "validation",
            fields: [
                { field: "name", message: "must not be empty" },
                { field: "description", message: "too long" },
            ],
        };
        (0, vitest_1.expect)(e.kind).toBe("validation");
        (0, vitest_1.expect)(e.fields).toHaveLength(2);
    });
    (0, vitest_1.it)("NotFoundError has kind 'not_found' with resource and id", () => {
        const e = { kind: "not_found", resource: "album", id: "123" };
        (0, vitest_1.expect)(e.kind).toBe("not_found");
        (0, vitest_1.expect)(e.resource).toBe("album");
        (0, vitest_1.expect)(e.id).toBe("123");
    });
    (0, vitest_1.it)("ForbiddenError has kind 'forbidden' with reason", () => {
        const e = { kind: "forbidden", reason: "not owner" };
        (0, vitest_1.expect)(e.kind).toBe("forbidden");
        (0, vitest_1.expect)(e.reason).toBe("not owner");
    });
    (0, vitest_1.it)("StorageError has kind 'storage' with message", () => {
        const e = { kind: "storage", message: "disk full" };
        (0, vitest_1.expect)(e.kind).toBe("storage");
    });
    (0, vitest_1.it)("ProcessingError has kind 'processing' with retryable flag", () => {
        const e = { kind: "processing", message: "timeout", retryable: true };
        (0, vitest_1.expect)(e.kind).toBe("processing");
        (0, vitest_1.expect)(e.retryable).toBe(true);
    });
});
(0, vitest_1.describe)("Pagination utilities", () => {
    (0, vitest_1.it)("paginate creates a PaginatedList from items and total count", () => {
        const input = { page: 1, limit: 10 };
        const result = (0, pagination_1.paginate)(["a", "b", "c"], 3, input);
        (0, vitest_1.expect)(result.items).toEqual(["a", "b", "c"]);
        (0, vitest_1.expect)(result.totalCount).toBe(3);
        (0, vitest_1.expect)(result.page).toBe(1);
        (0, vitest_1.expect)(result.limit).toBe(10);
        (0, vitest_1.expect)(result.hasMore).toBe(false);
    });
    (0, vitest_1.it)("paginate indicates hasMore when totalCount exceeds page * limit", () => {
        const input = { page: 1, limit: 2 };
        const result = (0, pagination_1.paginate)(["a", "b"], 5, input);
        (0, vitest_1.expect)(result.hasMore).toBe(true);
        (0, vitest_1.expect)(result.totalCount).toBe(5);
    });
    (0, vitest_1.it)("paginate handles empty results", () => {
        const input = { page: 1, limit: 10 };
        const result = (0, pagination_1.paginate)([], 0, input);
        (0, vitest_1.expect)(result.items).toEqual([]);
        (0, vitest_1.expect)(result.totalCount).toBe(0);
        (0, vitest_1.expect)(result.hasMore).toBe(false);
    });
    (0, vitest_1.it)("paginate works for pages beyond the first", () => {
        const input = { page: 3, limit: 10 };
        const result = (0, pagination_1.paginate)(["x"], 25, input);
        (0, vitest_1.expect)(result.page).toBe(3);
        (0, vitest_1.expect)(result.hasMore).toBe(false);
    });
});
//# sourceMappingURL=result.test.js.map