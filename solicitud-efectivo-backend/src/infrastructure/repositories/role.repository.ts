import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { IRoleRepository } from '../../core/domain/repositories/role.repository.interface';
import { Role } from '../../core/domain/entities/role.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { 
  IRoleFilters, 
  ICreateRoleData, 
  IUpdateRoleData, 
  IRolePaginatedResponse, 
  IRoleStats 
} from '../../core/domain/interfaces/role.interface';
import { UserRole } from '../../core/domain/user.interface';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(filters?: IRoleFilters): Promise<Role[]> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.roleName LIKE :role_name', { 
        role_name: `%${filters.role_name}%` 
      });
    }

    // Nota: role_desc no existe en la entidad/tabla actual

    if (filters?.valido !== undefined) {
      queryBuilder.andWhere('role.rowActive = :valido', { valido: filters.valido });
    }

    if (filters?.search) {
      queryBuilder.andWhere('role.roleName LIKE :search', { search: `%${filters.search}%` });
    }

    queryBuilder.orderBy('role.id', 'DESC');

    const entities = await queryBuilder.getMany();
    return entities.map(this.mapToDomain);
  }

  async findAllPaginated(
    filters?: IRoleFilters, 
    page?: number, 
    limit?: number
  ): Promise<IRolePaginatedResponse> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.roleName LIKE :role_name', { 
        role_name: `%${filters.role_name}%` 
      });
    }

    // Nota: role_desc no existe en la entidad/tabla actual

    if (filters?.valido !== undefined) {
      queryBuilder.andWhere('role.rowActive = :valido', { valido: filters.valido });
    }

    if (filters?.search) {
      queryBuilder.andWhere('role.roleName LIKE :search', { search: `%${filters.search}%` });
    }

    queryBuilder.orderBy('role.id', 'DESC');

    // Si no se especifican límites, traer todos los datos
    if (page !== undefined && limit !== undefined) {
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    
    // Si no hay paginación, retornar todos los datos
    if (page === undefined || limit === undefined) {
      return {
        data: entities.map(this.mapToDomain),
        total,
        page: 1,
        limit: total,
        totalPages: 1, hasNext: false, hasPrev: false,
      };
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: entities.map(this.mapToDomain),
      total,
      page,
      limit,
      totalPages, hasNext: page < totalPages, hasPrev: page > 1,
    };
  }

  async findById(id: number): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByName(roleName: string): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({ 
      where: { roleName: roleName } 
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async create(roleData: ICreateRoleData): Promise<Role> {
    const entity = this.roleRepository.create({
      roleName: roleData.role_name,
      rowActive: roleData.valido ?? true,
    });
    const savedEntity = await this.roleRepository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async update(id: number, roleData: IUpdateRoleData): Promise<Role | null> {
    const updatePayload: Partial<RoleEntity> = {};
    if (roleData.role_name !== undefined) {
      updatePayload.roleName = roleData.role_name;
    }
    if (roleData.valido !== undefined) {
      updatePayload.rowActive = roleData.valido;
    }

    const updateResult = await this.roleRepository.update(id, updatePayload);
    
    if (updateResult.affected === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const updateResult = await this.roleRepository.update(id, { rowActive: false });
    return updateResult.affected > 0;
  }

  async restore(id: number): Promise<boolean> {
    const updateResult = await this.roleRepository.update(id, { rowActive: true });
    return updateResult.affected > 0;
  }

  async hardDelete(id: number): Promise<boolean> {
    const deleteResult = await this.roleRepository.delete(id);
    return deleteResult.affected > 0;
  }

  async existsByName(roleName: string, excludeId?: number): Promise<boolean> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role')
      .where('role.roleName = :roleName', { roleName });

    if (excludeId) {
      queryBuilder.andWhere('role.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  async getStats(): Promise<IRoleStats> {
    const totalRoles = await this.roleRepository.count();
    const activeRoles = await this.roleRepository.count({ where: { rowActive: true } });
    const inactiveRoles = totalRoles - activeRoles;

    // Contar roles administrativos
    const administrativeRoles = await this.roleRepository.count({ 
      where: { 
        roleName: ILike('%administrador%'),
        rowActive: true 
      } 
    });

    const operationalRoles = activeRoles - administrativeRoles;

    return {
      totalRoles,
      activeRoles,
      inactiveRoles,
      administrativeRoles,
      operationalRoles,
    };
  }

  async findActiveRoles(): Promise<Role[]> {
    const entities = await this.roleRepository.find({ 
      where: { rowActive: true },
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async findInactiveRoles(): Promise<Role[]> {
    const entities = await this.roleRepository.find({ 
      where: { rowActive: false },
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async searchByText(searchText: string): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      where: [
        { roleName: ILike(`%${searchText}%`) }
      ],
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async count(filters?: IRoleFilters): Promise<number> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.roleName LIKE :role_name', { 
        role_name: `%${filters.role_name}%` 
      });
    }

    // Nota: role_desc no existe en la entidad/tabla actual

    if (filters?.valido !== undefined) {
      queryBuilder.andWhere('role.rowActive = :valido', { valido: filters.valido });
    }

    if (filters?.search) {
      queryBuilder.andWhere('role.roleName LIKE :search', { search: `%${filters.search}%` });
    }

    return queryBuilder.getCount();
  }

  /**
   * Mapea una entidad de infraestructura a una entidad de dominio
   */
  private mapToDomain(entity: RoleEntity): Role {
    return new Role(
      entity.id,
      entity.roleName,
      '', // role_desc ya no existe en la BD
      entity.rowActive,
    );
  }
}
