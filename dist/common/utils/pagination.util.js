"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtil = void 0;
const app_constants_1 = require("../constants/app.constants");
class PaginationUtil {
    static createPaginationOptions(page, limit) {
        const validPage = Math.max(1, page || app_constants_1.APP_CONSTANTS.PAGINATION.DEFAULT_PAGE);
        const validLimit = Math.min(limit || app_constants_1.APP_CONSTANTS.PAGINATION.DEFAULT_LIMIT, app_constants_1.APP_CONSTANTS.PAGINATION.MAX_LIMIT);
        return {
            page: validPage,
            limit: validLimit,
        };
    }
    static createPaginationResult(data, total, options) {
        const totalPages = Math.ceil(total / options.limit);
        const hasNext = options.page < totalPages;
        const hasPrev = options.page > 1;
        return {
            data,
            total,
            page: options.page,
            limit: options.limit,
            totalPages,
            hasNext,
            hasPrev,
        };
    }
    static getSkip(options) {
        return (options.page - 1) * options.limit;
    }
    static getTake(options) {
        return options.limit;
    }
}
exports.PaginationUtil = PaginationUtil;
//# sourceMappingURL=pagination.util.js.map