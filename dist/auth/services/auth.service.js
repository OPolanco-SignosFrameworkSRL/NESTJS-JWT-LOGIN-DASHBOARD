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
var AuthService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const user_write_entity_1 = require("../../entities/user-write.entity");
const crypto_service_1 = require("../../common/services/crypto.service");
const config_1 = require("@nestjs/config");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, cryptoService, configService, userRepository, userWriteRepository, dataSource) {
        this.jwtService = jwtService;
        this.cryptoService = cryptoService;
        this.configService = configService;
        this.userRepository = userRepository;
        this.userWriteRepository = userWriteRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(cedula, password) {
        if (!cedula || !password) {
            return null;
        }
        try {
            const user = await this.userRepository.findOne({
                where: { cedula, valido: true },
            });
            if (!user) {
                this.logger.warn(`Usuario no encontrado: ${cedula}`);
                return null;
            }
            const userWrite = await this.userWriteRepository.findOne({
                where: { cedula },
            });
            if (!userWrite) {
                this.logger.warn(`Usuario no encontrado en tabla de escritura: ${cedula}`);
                return null;
            }
            const hashedPassword = this.cryptoService.calculateSHA256(password);
            if (hashedPassword !== userWrite.password) {
                this.logger.warn(`Contraseña inválida para usuario: ${cedula}`);
                return null;
            }
            return {
                id: user.id,
                cedula: user.cedula,
                nombre: user.nombre,
                apellido: user.apellido,
                fullname: user.getFullName(),
                role: user.role,
                user_email: user.user_email,
                division: user.division,
                cargo: user.cargo,
                dependencia: user.dependencia,
                recinto: user.recinto,
                estado: user.estado,
                valido: user.valido,
            };
        }
        catch (error) {
            this.logger.error(`Error validando usuario ${cedula}:`, error);
            return null;
        }
    }
    async createUser(data) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { cedula: data.cedula },
            });
            if (existingUser) {
                return {
                    success: false,
                    error: 'Ya existe un usuario con esta cédula',
                };
            }
            const codigoHash = this.cryptoService.calculateSHA256(data.cedula + data.clave);
            const hashedPassword = this.cryptoService.calculateSHA256(data.password);
            const newUser = this.userWriteRepository.create({
                cedula: data.cedula,
                nombre: data.nombre,
                apellido: data.apellido,
                codigo: null,
                password: codigoHash,
                role: data.role || 'Usuario',
                user_email: data.user_email,
                valido: true,
            });
            const savedUser = await this.userWriteRepository.save(newUser);
            this.logger.log(`Usuario creado exitosamente: ${data.cedula}`);
            return {
                success: true,
                message: 'Usuario creado exitosamente',
                userId: savedUser[0].id,
            };
        }
        catch (error) {
            this.logger.error(`Error creando usuario ${data.cedula}:`, error);
            return {
                success: false,
                error: `Error interno del servidor: ${error.message}`,
            };
        }
    }
    async login(user) {
        const payload = {
            username: user.cedula,
            sub: user.id,
            fullname: user.fullname,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        const expiresIn = this.configService.get('JWT_EXPIRES_IN', '24h');
        this.logger.log(`Login exitoso para usuario: ${user.cedula}`);
        return {
            access_token: token,
            user: {
                id: user.id,
                cedula: user.cedula,
                fullname: user.fullname,
                apellido: user.apellido,
                role: user.role,
                user_email: user.user_email,
                division: user.division,
                cargo: user.cargo,
                dependencia: user.dependencia,
                recinto: user.recinto,
            },
            expires_in: this.parseExpiresIn(expiresIn),
        };
    }
    async checkUserInfo(cedula) {
        try {
            const user = await this.userRepository.findOne({ where: { cedula } });
            if (!user) {
                return { error: 'Usuario no encontrado' };
            }
            return {
                id: user.id,
                cedula: user.cedula,
                nombre: user.nombre,
                apellido: user.apellido,
                codigo: user.codigo,
                valido: user.valido,
                role: user.role,
                user_email: user.user_email,
                division: user.division,
                cargo: user.cargo,
                dependencia: user.dependencia,
                recinto: user.recinto,
                estado: user.estado,
                debug: {
                    message: 'El campo "codigo" ahora contiene el hash de la combinación de la cédula y la clave proporcionada por el usuario durante el registro.',
                },
            };
        }
        catch (error) {
            this.logger.error(`Error obteniendo información del usuario ${cedula}:`, error);
            return { error: 'Error interno del servidor' };
        }
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            this.logger.error('Error verificando token:', error);
            throw new common_1.UnauthorizedException('Token inválido');
        }
    }
    parseExpiresIn(expiresIn) {
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1));
        switch (unit) {
            case 's':
                return value;
            case 'm':
                return value * 60;
            case 'h':
                return value * 60 * 60;
            case 'd':
                return value * 24 * 60 * 60;
            default:
                return 24 * 60 * 60;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(user_write_entity_1.UserWrite)),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, crypto_service_1.CryptoService,
        config_1.ConfigService, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _d : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map