"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const file_storage_1 = require("@/infrastructure/file-storage");
(0, vitest_1.describe)("LocalFileStorageAdapter", () => {
    let adapter;
    let tmpDir;
    (0, vitest_1.beforeEach)(() => {
        tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), "photo-test-"));
        adapter = new file_storage_1.LocalFileStorageAdapter(tmpDir, "/files");
    });
    (0, vitest_1.afterEach)(() => {
        fs_1.default.rmSync(tmpDir, { recursive: true, force: true });
    });
    (0, vitest_1.describe)("store", () => {
        (0, vitest_1.it)("stores a file and returns a StoredFile with key, url, and sizeBytes", async () => {
            const data = Buffer.from("hello world");
            const result = await adapter.store("test-key.txt", data, "text/plain");
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.key).toBe("test-key.txt");
                (0, vitest_1.expect)(result.data.url).toBe("/files/test-key.txt");
                (0, vitest_1.expect)(result.data.sizeBytes).toBe(data.length);
            }
        });
        (0, vitest_1.it)("writes the file to the filesystem", async () => {
            const data = Buffer.from("file content");
            await adapter.store("myfile.bin", data, "application/octet-stream");
            const filePath = path_1.default.join(tmpDir, "myfile.bin");
            (0, vitest_1.expect)(fs_1.default.existsSync(filePath)).toBe(true);
            (0, vitest_1.expect)(fs_1.default.readFileSync(filePath).toString()).toBe("file content");
        });
        (0, vitest_1.it)("creates nested directories for keys with path separators", async () => {
            const data = Buffer.from("nested");
            const result = await adapter.store("a/b/file.txt", data, "text/plain");
            (0, vitest_1.expect)(result.success).toBe(true);
            (0, vitest_1.expect)(fs_1.default.existsSync(path_1.default.join(tmpDir, "a", "b", "file.txt"))).toBe(true);
        });
    });
    (0, vitest_1.describe)("retrieve", () => {
        (0, vitest_1.it)("retrieves a previously stored file", async () => {
            const data = Buffer.from("retrieve me");
            await adapter.store("retrieve-test.txt", data, "text/plain");
            const result = await adapter.retrieve("retrieve-test.txt");
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.toString()).toBe("retrieve me");
            }
        });
        (0, vitest_1.it)("returns a not_found error for missing files", async () => {
            const result = await adapter.retrieve("nonexistent.txt");
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                (0, vitest_1.expect)(result.error.kind).toBe("not_found");
            }
        });
    });
    (0, vitest_1.describe)("delete", () => {
        (0, vitest_1.it)("deletes a stored file", async () => {
            const data = Buffer.from("delete me");
            await adapter.store("to-delete.txt", data, "text/plain");
            const result = await adapter.delete("to-delete.txt");
            (0, vitest_1.expect)(result.success).toBe(true);
            (0, vitest_1.expect)(fs_1.default.existsSync(path_1.default.join(tmpDir, "to-delete.txt"))).toBe(false);
        });
        (0, vitest_1.it)("succeeds silently for non-existent files", async () => {
            const result = await adapter.delete("nonexistent.txt");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
    });
    (0, vitest_1.describe)("getUrl", () => {
        (0, vitest_1.it)("returns the public URL for a given key", () => {
            const url = adapter.getUrl("photos/abc.jpg");
            (0, vitest_1.expect)(url).toBe("/files/photos/abc.jpg");
        });
    });
});
//# sourceMappingURL=file-storage.test.js.map