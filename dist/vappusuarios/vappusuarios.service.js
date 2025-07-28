"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VappusuariosService = void 0;
const common_1 = require("@nestjs/common");
const sql = require("mssql");
let VappusuariosService = class VappusuariosService {
    async onModuleInit() {
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
    }
    async onModuleDestroy() {
        await this.pool.close();
    }
    async findAll() {
        const result = await this.pool.request().query('SELECT * FROM [dbo].[vappusuarios]');
        return result.recordset;
    }
};
exports.VappusuariosService = VappusuariosService;
exports.VappusuariosService = VappusuariosService = __decorate([
    (0, common_1.Injectable)()
], VappusuariosService);
