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


@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}
  restore(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  hardDelete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  existsByName(roleName: string, excludeId?: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findActiveRoles(): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }
  findInactiveRoles(): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }
  searchByText(searchText: string): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }
  count(filters?: IRoleFilters): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async findAll(filters?: IRoleFilters): Promise<Role[]> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.roleName LIKE :roleName', { 
        roleName: `%${filters.role_name}%` 
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere('(role.roleName LIKE :search)', {
        search: `%${filters.search}%`
      });
    }

    if (filters?.statusId) {
      queryBuilder.andWhere('role.statusId = :statusId', { 
        statusId: filters.statusId 
      });
    }

    const entities = await queryBuilder.getMany();
    return entities.map(this.mapToDomain);
  }

  async findAllPaginated(filters?: IRoleFilters, page?: number, limit?: number): Promise<IRolePaginatedResponse> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.roleName LIKE :roleName', { 
        roleName: `%${filters.role_name}%` 
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere('(role.roleName LIKE :search)', {
        search: `%${filters.search}%`
      });
    }

    if (filters?.statusId) {
      queryBuilder.andWhere('role.statusId = :statusId', { 
        statusId: filters.statusId 
      });
    }

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
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: entities.map(this.mapToDomain),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findById(id: number): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({ 
      where: { id },
      relations: ['status']
    });
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
      statusId: roleData.statusId || 1,
    });
  
    const savedEntity = await this.roleRepository.save(entity);
  
    const entityWithStatus = await this.roleRepository.findOne({
      where: { id: savedEntity.id }, // ojo: aquí probablemente es id, no statusId
      relations: ['status'],
    });
  
    return this.mapToDomain(entityWithStatus || savedEntity);
  }
  
  

  async update(id: number, roleData: IUpdateRoleData): Promise<Role | null> {
    const updatePayload: Partial<RoleEntity> = {};
    if (roleData.role_name !== undefined) {
      updatePayload.roleName = roleData.role_name;
    }
    if (roleData.statusId !== undefined) {
      updatePayload.statusId = roleData.statusId;
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

  async findActive(): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      where: { rowActive: true },
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async findInactive(): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      where: { rowActive: false },
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async findByStatus(statusId: number): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      where: { statusId },
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async getStats(): Promise<IRoleStats> {
    const totalRoles = await this.roleRepository.count();
    const activeRoles = await this.roleRepository.count({ 
      where: { rowActive: true } 
    });
    const inactiveRoles = totalRoles - activeRoles;

    // Stats básicos sin lógica compleja
    return {
      totalRoles,
      activeRoles,
      inactiveRoles,
      administrativeRoles: 0,
      operationalRoles: 0,
    };
  }

  /**
   * Mapea una entidad de infraestructura a una entidad de dominio
   */
  private mapToDomain(entity: RoleEntity): Role {
    const statusInfo = entity.status ? {
      status: entity.status.id,
      description: entity.status.description
    } : undefined;

    const role = new Role(
      entity.id,
      entity.roleName,
      '', // role_desc temporal hasta agregar columna en BD
      entity.rowActive,
      entity.statusId,
      statusInfo
    );

    return role;
  }
}