"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    getInfo() {
        return {
            name: 'API de Solicitud de Efectivo',
            version: '1.0.0',
            description: 'API para gestión de solicitudes de efectivo',
            status: 'running',
            timestamp: new Date().toISOString(),
        };
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Información de la aplicación',
        description: 'Retorna información básica sobre la API',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Información de la aplicación',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'API de Solicitud de Efectivo' },
                        version: { type: 'string', example: '1.0.0' },
                        description: {
                            type: 'string',
                            example: 'API para gestión de solicitudes de efectivo',
                        },
                        status: { type: 'string', example: 'running' },
                        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                    },
                },
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Operación exitosa' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getInfo", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Estado de salud de la aplicación',
        description: 'Verifica que la aplicación esté funcionando correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Aplicación funcionando correctamente',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Aplicación'),
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map