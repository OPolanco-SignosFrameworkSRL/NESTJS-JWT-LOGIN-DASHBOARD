import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RolesPermisosEntity } from '../database/entities/roles-permisos.entity';

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
}
