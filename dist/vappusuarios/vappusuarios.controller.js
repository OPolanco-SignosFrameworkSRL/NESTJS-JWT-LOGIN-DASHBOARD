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
exports.VappusuariosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vappusuarios_service_1 = require("./vappusuarios.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let VappusuariosController = class VappusuariosController {
    constructor(vappusuariosService) {
        this.vappusuariosService = vappusuariosService;
    }
    findAll() {
        return this.vappusuariosService.findAll();
    }
};
exports.VappusuariosController = VappusuariosController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener todos los usuarios de la vista',
        description: 'Obtiene todos los usuarios de la vista [dbo].[vappusuarios] (requiere JWT)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    cedula: { type: 'string', example: '00104168786' },
                    nombre: { type: 'string', example: 'Juan' },
                    apellido: { type: 'string', example: 'Pérez' },
                    codigo: { type: 'string', example: 'cng0grHUAxFiIiDcJSD6BA==' },
                    valido: { type: 'number', example: 1 }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token JWT requerido',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: 'Unauthorized' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VappusuariosController.prototype, "findAll", null);
exports.VappusuariosController = VappusuariosController = __decorate([
    (0, swagger_1.ApiTags)('vappusuarios'),
    (0, common_1.Controller)('vappusuarios'),
    __metadata("design:paramtypes", [vappusuarios_service_1.VappusuariosService])
], VappusuariosController);
