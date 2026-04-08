"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
function paginate(items, totalCount, input) {
    return {
        items,
        totalCount,
        page: input.page,
        limit: input.limit,
        hasMore: input.page * input.limit < totalCount,
    };
}
//# sourceMappingURL=pagination.js.map