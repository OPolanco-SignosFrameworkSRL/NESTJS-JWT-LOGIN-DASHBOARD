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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sql = require("mssql");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.CLAVE_FIJA = 'Hola123';
    }
    async onModuleInit() {
        try {
            this.pool = await sql.connect({
                user: 'sa',
                password: '$ignos1234',
                server: '10.8.2.226',
                port: 1433,
                database: 'DbSolicitudEfectivo',
                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                    connectTimeout: 5000,
                    requestTimeout: 10000,
                },
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000,
                }
            });
            console.log('✅ Conexión a base de datos establecida en AuthService');
        }
        catch (error) {
            console.error('Error conectando a la base de datos:', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        if (this.pool) {
            await this.pool.close();
        }
    }
    async validateUser(cedula, _password) {
        if (!cedula) {
            return null;
        }
        try {
            const result = await this.pool.request()
                .input('cedula', sql.VarChar, cedula)
                .query(`
          SELECT * FROM [dbo].[vappusuarios]
          WHERE cedula = @cedula AND valido = 1
        `);
            if (result.recordset.length === 0) {
                return null;
            }
            const user = result.recordset[0];
            const expectedHash = this.calculateSHA256(cedula + this.CLAVE_FIJA);
            if (expectedHash !== user.codigo) {
                return null;
            }
            return {
                id: user.id,
                cedula: user.cedula,
                nombre: user.nombre,
                apellido: user.apellido,
                fullname: `${user.nombre} ${user.apellido}`,
                role: user.role || 'Usuario',
                user_email: user.user_email || `${user.cedula}@grupoastro.com.do`,
                division: user.division || 'N/A',
                cargo: user.cargo || 'N/A',
                dependencia: user.dependencia || 'N/A',
                recinto: user.recinto || 'N/A',
                estado: user.estado || 'ACTIVO'
            };
        }
        catch (error) {
            console.error('❌ Error validando usuario:', error);
            return null;
        }
    }
    calculateSHA256(input) {
        return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
    }
    async login(user) {
        const payload = {
            username: user.cedula,
            sub: user.id,
            fullname: user.fullname,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                cedula: user.cedula,
                fullname: user.fullname,
                role: user.role,
                user_email: user.user_email
            }
        };
    }
    async checkUserInfo(cedula) {
        try {
            const result = await this.pool.request()
                .input('cedula', sql.VarChar, cedula)
                .query(`
          SELECT id, cedula, nombre, apellido, codigo, valido, role, user_email,
                 division, cargo, dependencia, recinto, estado
          FROM [dbo].[vappusuarios]
          WHERE cedula = @cedula
        `);
            if (result.recordset.length === 0) {
                return { error: 'Usuario no encontrado' };
            }
            const user = result.recordset[0];
            const hashInput = cedula + this.CLAVE_FIJA;
            const expectedHash = this.calculateSHA256(hashInput);
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
                    hashInput: hashInput,
                    expectedHash: expectedHash,
                    hashMatches: expectedHash === user.codigo
                }
            };
        }
        catch (error) {
            console.error('Error obteniendo información del usuario:', error);
            return { error: 'Error interno del servidor' };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
