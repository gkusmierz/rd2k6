"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.err = err;
exports.isOk = isOk;
exports.isErr = isErr;
function ok(data) {
    return { success: true, data };
}
function err(error) {
    return { success: false, error };
}
function isOk(result) {
    return result.success;
}
function isErr(result) {
    return !result.success;
}
//# sourceMappingURL=result.js.map