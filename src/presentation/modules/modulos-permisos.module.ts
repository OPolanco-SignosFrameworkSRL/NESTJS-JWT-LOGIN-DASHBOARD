import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulosPermisosController } from '../controllers/modulos-permisos.controller';
import { ModulosPermisosService } from '../../core/domain/services/modulos-permisos.service';
import { ModuloPermisoRepository } from '../../infrastructure/repositories/modulo-permiso.repository';
import { ModuloRepository } from '../../infrastructure/repositories/modulo.repository';
import { RolesPermisosRepository } from '../../infrastructure/repositories/roles-permisos.repository';
import { ModuloPermisoEntity } from '../../infrastructure/database/entities/modulo-permiso.entity';
import { ModuloEntity } from '../../infrastructure/database/entities/modulo.entity';
import { RolesPermisosEntity } from '../../infrastructure/database/entities/roles-permisos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuloPermisoEntity, ModuloEntity, RolesPermisosEntity]),
  ],
  controllers: [ModulosPermisosController],
  providers: [
    ModulosPermisosService,
    ModuloPermisoRepository,
    ModuloRepository,
    RolesPermisosRepository,
  ],
  exports: [
    ModulosPermisosService,
    ModuloPermisoRepository,
    ModuloRepository,
    RolesPermisosRepository,
  ],
})
export class ModulosPermisosModule {}
