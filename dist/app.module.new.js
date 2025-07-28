"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_new_1 = require("./auth/auth.module.new");
const vappusuarios_module_1 = require("./vappusuarios/vappusuarios.module");
const app_controller_1 = require("./app.controller");
const user_entity_1 = require("./auth/entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mssql',
                    host: configService.get('DB_HOST', '10.8.2.226'),
                    port: configService.get('DB_PORT', 1433),
                    username: configService.get('DB_USERNAME', 'sa'),
                    password: configService.get('DB_PASSWORD', '$ignos1234'),
                    database: configService.get('DB_DATABASE', 'DbSolicitudEfectivo'),
                    entities: [user_entity_1.User],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                    options: {
                        encrypt: true,
                        trustServerCertificate: true,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_new_1.AuthModule,
            vappusuarios_module_1.VappusuariosModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.new.js.map