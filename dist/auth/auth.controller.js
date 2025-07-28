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
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        console.log('🚀 Login request received:', body);
        const user = await this.authService.validateUser(body.cedula, body.password);
        console.log('👤 User validation result:', user ? 'SUCCESS' : 'FAILED');
        if (!user) {
            console.log('❌ Login failed - invalid credentials');
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        console.log('✅ Login successful, generating token');
        return this.authService.login(user);
    }
    async getProfile(req) {
        return {
            message: 'Perfil obtenido exitosamente',
            user: req.user
        };
    }
    async checkUser(req) {
        const cedula = req.params.cedula;
        const result = await this.authService.checkUserInfo(cedula);
        if (result.error) {
            return { found: false, message: result.error };
        }
        return {
            found: true,
            user: {
                cedula: result.cedula,
                nombre: result.nombre,
                apellido: result.apellido,
                codigo: result.codigo,
                valido: result.valido,
                debug: result.debug
            }
        };
    }
    test() {
        return {
            message: 'Auth controller is working!',
            timestamp: new Date().toISOString(),
            endpoints: [
                'POST /auth/login',
                'GET /auth/profile (protected)',
                'GET /auth/check-user/:cedula'
            ]
        };
    }
    testHash() {
        const cedula = '00104168786';
        const claveFija = 'Hola123';
        const hashInput = cedula + claveFija;
        const hashResult = require('crypto').createHash('sha256').update(hashInput, 'utf8').digest('hex');
        return {
            cedula,
            claveFija,
            hashInput,
            hashResult,
            expectedHash: 'e1bb0c390d430c61482ba2119e3770e015cced4d7be512185312d042d81cebd4',
            matches: hashResult === 'e1bb0c390d430c61482ba2119e3770e015cced4d7be512185312d042d81cebd4'
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Iniciar sesión',
        description: 'Valida credenciales de cédula y contraseña, genera token JWT'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                cedula: { type: 'string', example: '00104168786' },
                password: { type: 'string', example: '******' }
            },
            required: ['cedula', 'password']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login exitoso',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        cedula: { type: 'string', example: '00104168786' },
                        fullname: { type: 'string', example: 'KENNY RODRIGUEZ' },
                        role: { type: 'string', example: 'Usuario' },
                        user_email: { type: 'string', example: '00104168786@grupoastro.com.do' }
                    }
                }
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
    __metadata("design:paramtypes", [Object]),
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
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        cedula: { type: 'string', example: '00104168786' },
                        fullname: { type: 'string', example: 'KENNY RODRIGUEZ' },
                        role: { type: 'string', example: 'Usuario' }
                    }
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
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('check-user/:cedula'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verificar información de usuario',
        description: 'Obtiene información básica del usuario (solo para debugging administrativo)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Información del usuario',
        schema: {
            type: 'object',
            properties: {
                found: { type: 'boolean', example: true },
                user: {
                    type: 'object',
                    properties: {
                        cedula: { type: 'string', example: '00104168786' },
                        nombre: { type: 'string', example: 'KENNY' },
                        apellido: { type: 'string', example: 'RODRIGUEZ' },
                        codigo: { type: 'string', example: '[ENCRYPTED]' },
                        valido: { type: 'number', example: 1 }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Usuario no encontrado',
        schema: {
            type: 'object',
            properties: {
                found: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Usuario no encontrado' }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUser", null);
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
                        'POST /auth/login',
                        'GET /auth/profile (protected)',
                        'GET /auth/check-user/:cedula'
                    ]
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('test-hash'),
    (0, swagger_1.ApiOperation)({
        summary: 'Probar hash SHA-256',
        description: 'Prueba el algoritmo de hash SHA-256 para debugging'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Información del hash',
        schema: {
            type: 'object',
            properties: {
                cedula: { type: 'string', example: '00104168786' },
                claveFija: { type: 'string', example: 'Hola123' },
                hashInput: { type: 'string', example: '00104168786Hola123' },
                hashResult: { type: 'string', example: 'e1bb0c390d430c61482ba2119e3770e015cced4d7be512185312d042d81cebd4' }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "testHash", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
