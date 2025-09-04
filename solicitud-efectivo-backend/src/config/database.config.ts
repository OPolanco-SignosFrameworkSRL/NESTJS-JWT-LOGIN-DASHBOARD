import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../infrastructure/database/entities/user-write.entity';
import { UsuarioRolEntity } from '../infrastructure/database/entities/usuario-rol.entity';
import { RoleEntity } from '../infrastructure/database/entities/role.entity';
import { CashRequestEntity } from '../infrastructure/database/entities/cash-request.entity';
import { CashRequestWriteEntity } from '../infrastructure/database/entities/cash-request-write.entity';
import { SolicitudGeneralEntity } from '../infrastructure/database/entities/solicitud-general.entity';
import { CommentEntity } from '../infrastructure/database/entities/comment.entity';
import { DesembolsoEntity } from '../infrastructure/database/entities/desembolso.entity';
import { ModuloEntity } from '../infrastructure/database/entities/modulo.entity';
import { ModuloPermisoEntity } from '../infrastructure/database/entities/modulo-permiso.entity';
import { RolesPermisosEntity } from '../infrastructure/database/entities/roles-permisos.entity';
import { SolicitudEfectivoEntity } from '../infrastructure/database/entities/solicitud-efectivo.entity';
import { IntegranteDesembolsoEntity } from '../infrastructure/database/entities/integrante-desembolso.entity';
import { GaColaboradoresEntity } from '../infrastructure/database/entities/ga-colaboradores.entity';
import { SolicitudTipoEntity } from '../infrastructure/database/entities/solicitud-tipo.entity';
import { StatusEntity } from '../infrastructure/database/entities/status.entity';
import { DivisionEntity } from '../infrastructure/database/entities/division.entity';


export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: configService.get<string>('DB_HOST', '10.8.2.226'),
  port: parseInt(configService.get<string>('DB_PORT', '1439'), 10),
  username: configService.get<string>('DB_USERNAME', 'Omar'),
  password: configService.get<string>('DB_PASSWORD', 'Omar12345'),
  database: configService.get<string>('DB_DATABASE', 'DbSolicitudEfectivo_v1'),
  entities: [
    UserEntity,
    UserWriteEntity,
    UsuarioRolEntity,
    RoleEntity,
    CashRequestEntity,
    CashRequestWriteEntity,
    SolicitudGeneralEntity,
    CommentEntity,
    DesembolsoEntity,
    ModuloEntity,
    ModuloPermisoEntity,
    RolesPermisosEntity,
    SolicitudEfectivoEntity,
    IntegranteDesembolsoEntity,
    GaColaboradoresEntity,
    SolicitudTipoEntity,
    StatusEntity,
    DivisionEntity,
  ],
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
