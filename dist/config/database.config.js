"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (configService) => ({
    type: 'mssql',
    host: configService.get('DB_HOST', '10.8.2.226'),
    port: parseInt(configService.get('DB_PORT', '1433'), 10),
    username: configService.get('DB_USERNAME', 'sa'),
    password: configService.get('DB_PASSWORD', '$ignos1234'),
    database: configService.get('DB_DATABASE', 'DbSolicitudEfectivo'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: configService.get('DB_LOGGING', false),
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    extra: {
        connectionTimeout: 30000,
        requestTimeout: 30000,
    },
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map