import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: configService.get<string>('DB_HOST', '10.8.2.226'),
  port: parseInt(configService.get<string>('DB_PORT', '1433'), 10),
  username: configService.get<string>('DB_USERNAME', 'sa'),
  password: configService.get<string>('DB_PASSWORD', '$ignos1234'),
  database: configService.get<string>('DB_DATABASE', 'DbSolicitudEfectivo'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Deshabilitado porque vappusuarios es una vista, no una tabla
  logging: configService.get<boolean>('DB_LOGGING', false),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  extra: {
    connectionTimeout: 30000,
    requestTimeout: 30000,
  },
});
