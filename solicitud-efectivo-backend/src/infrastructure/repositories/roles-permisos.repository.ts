import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RolesPermisosEntity } from '../database/entities/roles-permisos.entity';
import { ModuloPermisoEntity } from '../database/entities/modulo-permiso.entity';

@Injectable()
export class RolesPermisosRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(idRol: number, idPermiso: number, userId: number): Promise<RolesPermisosEntity> {
    const repository = this.dataSource.getRepository(RolesPermisosEntity);
    const rolesPermisos = repository.create({
      IdRol: idRol,
      IdPermiso: idPermiso,
      RowActive: true,
      UserAdd: userId
    });
    return repository.save(rolesPermisos);
  }

  async findByRolAndPermiso(idRol: number, idPermiso: number): Promise<RolesPermisosEntity | null> {
    const repository = this.dataSource.getRepository(RolesPermisosEntity);
    return repository.findOne({
      where: { IdRol: idRol, IdPermiso: idPermiso, RowActive: true }
    });
  }

  // Busca si ya existe una relación activo entre un rol y CUALQUIER permiso del mismo módulo
  async findByRolAndModulo(idRol: number, idModulo: number): Promise<RolesPermisosEntity | null> {
    const rpRepo = this.dataSource.getRepository(RolesPermisosEntity);
    return rpRepo
      .createQueryBuilder('rp')
      .innerJoin(ModuloPermisoEntity, 'mp', 'rp.IdPermiso = mp.Id AND mp.RowActive = 1')
      .where('rp.IdRol = :idRol', { idRol })
      .andWhere('rp.RowActive = 1')
      .andWhere('mp.IdModulo = :idModulo', { idModulo })
      .getOne();
  }
}
