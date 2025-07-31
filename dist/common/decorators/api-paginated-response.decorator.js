"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPaginatedResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiPaginatedResponse = (model) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOkResponse)({
        schema: {
            allOf: [
                {
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                                },
                                total: { type: 'number', example: 100 },
                                page: { type: 'number', example: 1 },
                                limit: { type: 'number', example: 10 },
                                totalPages: { type: 'number', example: 10 },
                                hasNext: { type: 'boolean', example: true },
                                hasPrev: { type: 'boolean', example: false },
                            },
                        },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Operación exitosa' },
                        timestamp: {
                            type: 'string',
                            example: '2025-07-29T15:19:04.441Z',
                        },
                    },
                },
            ],
        },
    }));
};
exports.ApiPaginatedResponse = ApiPaginatedResponse;
//# sourceMappingURL=api-paginated-response.decorator.js.map