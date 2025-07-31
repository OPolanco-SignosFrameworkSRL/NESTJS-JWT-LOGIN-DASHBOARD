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
var UsersService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findAll(filters) {
        try {
            const queryBuilder = this.createQueryBuilder(filters);
            const users = await queryBuilder.getMany();
            return users.map(user => this.mapToUserResponse(user));
        }
        catch (error) {
            this.logger.error('Error obteniendo usuarios:', error);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id, valido: true },
            });
            if (!user) {
                throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
            }
            return this.mapToUserResponse(user);
        }
        catch (error) {
            this.logger.error(`Error obteniendo usuario ${id}:`, error);
            throw error;
        }
    }
    async findByCedula(cedula) {
        try {
            const user = await this.userRepository.findOne({
                where: { cedula, valido: true },
            });
            if (!user) {
                throw new common_1.NotFoundException(`Usuario con cédula ${cedula} no encontrado`);
            }
            return this.mapToUserResponse(user);
        }
        catch (error) {
            this.logger.error(`Error obteniendo usuario por cédula ${cedula}:`, error);
            throw error;
        }
    }
    async update(_id, _updateData) {
        throw new Error('La actualización de usuarios está deshabilitada. vappusuarios es una vista de solo lectura.');
    }
    async remove(_id) {
        throw new Error('La eliminación de usuarios está deshabilitada. vappusuarios es una vista de solo lectura.');
    }
    async searchByTerm(term) {
        try {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .where('user.valido = :valido', { valido: true })
                .andWhere('(user.nombre LIKE :term OR user.apellido LIKE :term OR user.cedula LIKE :term)', { term: `%${term}%` })
                .orderBy('user.nombre', 'ASC')
                .getMany();
            return users.map(user => this.mapToUserResponse(user));
        }
        catch (error) {
            this.logger.error(`Error buscando usuarios con término "${term}":`, error);
            throw error;
        }
    }
    async findByRole(role) {
        try {
            const users = await this.userRepository.find({
                where: { role: role, valido: true },
                order: { nombre: 'ASC' },
            });
            return users.map(user => this.mapToUserResponse(user));
        }
        catch (error) {
            this.logger.error(`Error obteniendo usuarios por rol ${role}:`, error);
            throw error;
        }
    }
    async findByDivision(division) {
        try {
            const users = await this.userRepository.find({
                where: { division, valido: true },
                order: { nombre: 'ASC' },
            });
            return users.map(user => this.mapToUserResponse(user));
        }
        catch (error) {
            this.logger.error(`Error obteniendo usuarios por división ${division}:`, error);
            throw error;
        }
    }
    async getStats() {
        try {
            const totalUsers = await this.userRepository.count({
                where: { valido: true },
            });
            const usersByRole = await this.userRepository
                .createQueryBuilder('user')
                .select('user.role', 'role')
                .addSelect('COUNT(*)', 'count')
                .where('user.valido = :valido', { valido: true })
                .groupBy('user.role')
                .getRawMany();
            const usersByDivision = await this.userRepository
                .createQueryBuilder('user')
                .select('user.division', 'division')
                .addSelect('COUNT(*)', 'count')
                .where('user.valido = :valido', { valido: true })
                .groupBy('user.division')
                .getRawMany();
            return {
                totalUsers,
                usersByRole,
                usersByDivision,
            };
        }
        catch (error) {
            this.logger.error('Error obteniendo estadísticas de usuarios:', error);
            throw error;
        }
    }
    async exists(cedula) {
        try {
            const count = await this.userRepository.count({
                where: { cedula, valido: true },
            });
            return count > 0;
        }
        catch (error) {
            this.logger.error(`Error verificando existencia de usuario ${cedula}:`, error);
            return false;
        }
    }
    createQueryBuilder(filters) {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .where('user.valido = :valido', { valido: true });
        if (filters?.role) {
            queryBuilder.andWhere('user.role = :role', {
                role: filters.role,
            });
        }
        if (filters?.division) {
            queryBuilder.andWhere('user.division = :division', {
                division: filters.division,
            });
        }
        if (filters?.search) {
            queryBuilder.andWhere('(user.nombre LIKE :search OR user.apellido LIKE :search OR user.cedula LIKE :search)', { search: `%${filters.search}%` });
        }
        if (filters?.active !== undefined) {
            queryBuilder.andWhere('user.estado = :estado', {
                estado: filters.active ? 'ACTIVO' : 'INACTIVO',
            });
        }
        return queryBuilder.orderBy('user.nombre', 'ASC');
    }
    mapToUserResponse(user) {
        return {
            id: user.id,
            cedula: user.cedula,
            fullname: user.getFullName(),
            apellido: user.apellido,
            role: user.role,
            user_email: user.user_email,
            division: user.division,
            cargo: user.cargo,
            dependencia: user.dependencia,
            recinto: user.recinto,
            estado: user.estado,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UsersService);
//# sourceMappingURL=users.service.js.map