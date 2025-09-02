import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulosPermisosController } from '../controllers/modulos-permisos.controller';
import { ModulosPermisosService } from '../../core/domain/services/modulos-permisos.service';
import { ModuloPermisoRepository } from '../../infrastructure/repositories/modulo-permiso.repository';
import { ModuloPermisoEntity } from '../../infrastructure/database/entities/modulo-permiso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuloPermisoEntity]),
  ],
  controllers: [ModulosPermisosController],
  providers: [
    ModulosPermisosService,
    ModuloPermisoRepository,
  ],
  exports: [
    ModulosPermisosService,
    ModuloPermisoRepository,
  ],
})
export class ModulosPermisosModule {}
