"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileStorageAdapter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const result_1 = require("@/common/result");
class LocalFileStorageAdapter {
    basePath;
    urlPrefix;
    constructor(basePath, urlPrefix) {
        this.basePath = basePath;
        this.urlPrefix = urlPrefix;
    }
    async store(key, data, _contentType) {
        try {
            const filePath = path_1.default.join(this.basePath, key);
            const dir = path_1.default.dirname(filePath);
            fs_1.default.mkdirSync(dir, { recursive: true });
            fs_1.default.writeFileSync(filePath, data);
            return (0, result_1.ok)({
                key,
                url: this.getUrl(key),
                sizeBytes: data.length,
            });
        }
        catch (e) {
            return (0, result_1.err)({ kind: "storage", message: e.message });
        }
    }
    async retrieve(key) {
        try {
            const filePath = path_1.default.join(this.basePath, key);
            if (!fs_1.default.existsSync(filePath)) {
                return (0, result_1.err)({ kind: "not_found", resource: "file", id: key });
            }
            return (0, result_1.ok)(fs_1.default.readFileSync(filePath));
        }
        catch (e) {
            return (0, result_1.err)({ kind: "storage", message: e.message });
        }
    }
    async delete(key) {
        try {
            const filePath = path_1.default.join(this.basePath, key);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            return (0, result_1.ok)(undefined);
        }
        catch (e) {
            return (0, result_1.err)({ kind: "storage", message: e.message });
        }
    }
    getUrl(key) {
        return `${this.urlPrefix}/${key}`;
    }
}
exports.LocalFileStorageAdapter = LocalFileStorageAdapter;
//# sourceMappingURL=file-storage.js.map