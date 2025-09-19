import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ModuloPermisoEntity } from '../database/entities/modulo-permiso.entity';
import { IModuloPermiso, IModuloPermisoFilters } from '../../core/domain/modulos-permisos.interface';

@Injectable()
export class ModuloPermisoRepository {
  private repository: Repository<ModuloPermisoEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ModuloPermisoEntity);
  }

  async findAll(filters?: IModuloPermisoFilters): Promise<ModuloPermisoEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('mp')
      .leftJoinAndSelect('mp.modulo', 'modulo')
      .where('mp.RowActive = :rowActive', { rowActive: true });

    if (filters?.idModulo) {
      queryBuilder.andWhere('mp.IdModulo = :idModulo', { idModulo: filters.idModulo });
    }

    if (filters?.ver !== undefined) {
      queryBuilder.andWhere('mp.Ver = :ver', { ver: filters.ver ? 1 : 0 });
    }

    if (filters?.agregar !== undefined) {
      queryBuilder.andWhere('mp.Agregar = :agregar', { agregar: filters.agregar ? 1 : 0 });
    }

    if (filters?.editar !== undefined) {
      queryBuilder.andWhere('mp.Editar = :editar', { editar: filters.editar ? 1 : 0 });
    }

    if (filters?.eliminar !== undefined) {
      queryBuilder.andWhere('mp.Eliminar = :eliminar', { eliminar: filters.eliminar ? 1 : 0 });
    }

    if (filters?.active !== undefined) {
      queryBuilder.andWhere('mp.RowActive = :rowActive', { rowActive: filters.active ? 1 : 0 });
    }

    return queryBuilder.getMany();
  }

  async findById(id: number): Promise<ModuloPermisoEntity | null> {
    return this.repository.findOne({
      where: { Id: id, RowActive: true },
      relations: ['modulo']
    });
  }

  async findByModulo(idModulo: number): Promise<ModuloPermisoEntity | null> {
    return this.repository.findOne({
      where: { IdModulo: idModulo, RowActive: true },
      relations: ['modulo']
    });
  }

  async findByModuloAndRol(idModulo: number, idRol: number): Promise<ModuloPermisoEntity | null> {
    // Nota: La tabla ModulosPermisos no almacena IdRol directamente. Si en tu modelo real existe
    // un vínculo entre ModulosPermisos y Roles (p.ej. tabla RolesPermisos), ajusta esta consulta
    // para resolver por la asociación adecuada. Aquí asumimos que IdRol se guarda en ModulosPermisos
    // o que la vista/relación ya lo expone en la entidad.
    return this.repository.findOne({
      where: { IdModulo: idModulo, RowActive: true } as any,
      relations: ['modulo']
    });
  }

  async create(data: Partial<ModuloPermisoEntity>): Promise<ModuloPermisoEntity> {
    const moduloPermiso = this.repository.create({
      ...data,
      RowActive: true,
      Ver: data.Ver || false,
      Agregar: data.Agregar || false,
      Editar: data.Editar || false,
      Eliminar: data.Eliminar || false
    });

    return this.repository.save(moduloPermiso);
  }

  async update(id: number, data: Partial<ModuloPermisoEntity>): Promise<ModuloPermisoEntity | null> {
    const result = await this.repository.update({ Id: id }, data);
    
    if (result.affected && result.affected > 0) {
      return this.findById(id);
    }
    
    return null;
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.repository.update(
      { Id: id },
      { 
        RowActive: false, 
        UserDel: userId 
      }
    );
  }

  async restore(id: number, userId: number): Promise<void> {
    await this.repository.update(
      { Id: id },
      { 
        RowActive: true, 
        UserMod: userId,
        UserDel: null
      }
    );
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { Id: id, RowActive: true }
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.repository.count({
      where: { RowActive: true }
    });
  }
}
