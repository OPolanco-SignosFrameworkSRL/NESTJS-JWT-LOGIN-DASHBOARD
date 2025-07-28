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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_new_1 = require("./auth.service.new");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async getProfile(req) {
        const userId = req.user.sub;
        const user = await this.authService.findById(userId);
        if (!user) {
            return { message: 'Usuario no encontrado' };
        }
        return {
            message: 'Perfil obtenido exitosamente',
            user
        };
    }
    async getCurrentUser(req) {
        const userId = req.user.sub;
        const user = await this.authService.findById(userId);
        if (!user) {
            return { message: 'Usuario no encontrado' };
        }
        return {
            message: 'Información del usuario obtenida exitosamente',
            user
        };
    }
    async validateCredentials(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            return {
                valid: false,
                message: 'Credenciales inválidas'
            };
        }
        return {
            valid: true,
            message: 'Credenciales válidas',
            user
        };
    }
    test() {
        return {
            message: 'Auth controller is working!',
            timestamp: new Date().toISOString(),
            endpoints: [
                'POST /auth/register',
                'POST /auth/login',
                'GET /auth/profile (protected)',
                'GET /auth/me (protected)',
                'POST /auth/validate'
            ]
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Registrar nuevo usuario',
        description: 'Crea un nuevo usuario con contraseña encriptada'
    }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario registrado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Usuario registrado exitosamente' },
                user: { $ref: '#/components/schemas/User' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'El email ya está registrado',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 409 },
                message: { type: 'string', example: 'El email ya está registrado' },
                error: { type: 'string', example: 'Conflict' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Iniciar sesión',
        description: 'Valida credenciales y genera token JWT'
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login exitoso',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: { $ref: '#/components/schemas/User' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Credenciales inválidas',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: 'Credenciales inválidas' },
                error: { type: 'string', example: 'Unauthorized' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener perfil del usuario',
        description: 'Obtiene el perfil del usuario autenticado (requiere JWT)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil obtenido exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Perfil obtenido exitosamente' },
                user: { $ref: '#/components/schemas/User' }
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
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener información del usuario actual',
        description: 'Endpoint alternativo para obtener información del usuario autenticado'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Información del usuario obtenida exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Información del usuario obtenida exitosamente' },
                user: { $ref: '#/components/schemas/User' }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Validar credenciales',
        description: 'Valida las credenciales sin generar token JWT'
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Credenciales válidas',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Credenciales válidas' },
                user: { $ref: '#/components/schemas/User' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Credenciales inválidas',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Credenciales inválidas' }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateCredentials", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Probar controlador',
        description: 'Endpoint de prueba para verificar que el controlador funciona'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Controlador funcionando correctamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Auth controller is working!' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                endpoints: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [
                        'POST /auth/register',
                        'POST /auth/login',
                        'GET /auth/profile (protected)',
                        'GET /auth/me (protected)',
                        'POST /auth/validate'
                    ]
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "test", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [auth_service_new_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.new.js.map