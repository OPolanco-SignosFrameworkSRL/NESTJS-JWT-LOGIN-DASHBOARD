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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, role } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName: firstName || '',
            lastName: lastName || '',
            role: role || user_entity_1.UserRole.USER,
            isActive: true,
        });
        const savedUser = await this.userRepository.save(newUser);
        const { password: _ } = savedUser, userWithoutPassword = __rest(savedUser, ["password"]);
        return {
            message: 'Usuario registrado exitosamente',
            user: userWithoutPassword,
        };
    }
    async validateUser(email, password) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user || !user.isActive) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        }
        catch (error) {
            console.error('Error validando usuario:', error);
            return null;
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user,
        };
    }
    async findById(id) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user || !user.isActive) {
                return null;
            }
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        }
        catch (error) {
            console.error('Error buscando usuario por ID:', error);
            return null;
        }
    }
    async findByEmail(email) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user || !user.isActive) {
                return null;
            }
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        }
        catch (error) {
            console.error('Error buscando usuario por email:', error);
            return null;
        }
    }
    async updatePassword(userId, newPassword) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            await this.userRepository.update(userId, { password: hashedPassword });
            return { message: 'Contraseña actualizada exitosamente' };
        }
        catch (error) {
            console.error('Error actualizando contraseña:', error);
            throw new Error('Error al actualizar la contraseña');
        }
    }
    async deactivateUser(userId) {
        try {
            await this.userRepository.update(userId, { isActive: false });
            return { message: 'Usuario desactivado exitosamente' };
        }
        catch (error) {
            console.error('Error desactivando usuario:', error);
            throw new Error('Error al desactivar el usuario');
        }
    }
    async findAllUsers() {
        try {
            const users = await this.userRepository.find({
                where: { isActive: true },
                select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'updatedAt'],
            });
            return users;
        }
        catch (error) {
            console.error('Error obteniendo usuarios:', error);
            throw new Error('Error al obtener los usuarios');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.new.js.map