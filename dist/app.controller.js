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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    getHello() {
        return 'Hello World!';
    }
    test() {
        return { message: 'App controller is working!' };
    }
    loginTest(body) {
        return {
            message: 'Login test endpoint',
            received: body,
            timestamp: new Date().toISOString()
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Endpoint raíz',
        description: 'Endpoint principal de la aplicación'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Respuesta exitosa',
        schema: {
            type: 'string',
            example: 'Hello World!'
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Probar aplicación',
        description: 'Endpoint de prueba para verificar que la aplicación funciona'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Aplicación funcionando correctamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'App controller is working!' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('login-test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Probar login',
        description: 'Endpoint de prueba para simular un login'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login de prueba exitoso',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Login test endpoint' },
                received: { type: 'object', example: { email: 'test@test.com', password: '123456' } },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "loginTest", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('app'),
    (0, common_1.Controller)()
], AppController);
