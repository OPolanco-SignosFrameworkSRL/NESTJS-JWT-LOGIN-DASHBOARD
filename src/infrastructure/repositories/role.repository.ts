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

  async findAll(filters?: IRoleFilters): Promise<Role[]> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.role_name LIKE :role_name', { 
        role_name: `%${filters.role_name}%` 
      });
    }

    if (filters?.role_desc) {
      queryBuilder.andWhere('role.role_desc LIKE :role_desc', { 
        role_desc: `%${filters.role_desc}%` 
      });
    }

    if (filters?.valido !== undefined) {
      queryBuilder.andWhere('role.valido = :valido', { valido: filters.valido });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(role.role_name LIKE :search OR role.role_desc LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder.orderBy('role.id', 'DESC');

    const entities = await queryBuilder.getMany();
    return entities.map(this.mapToDomain);
  }

  async findAllPaginated(
    filters?: IRoleFilters, 
    page: number = 1, 
    limit: number = 10
  ): Promise<IRolePaginatedResponse> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.role_name LIKE :role_name', { 
        role_name: `%${filters.role_name}%` 
      });
    }

    if (filters?.role_desc) {
      queryBuilder.andWhere('role.role_desc LIKE :role_desc', { 
        role_desc: `%${filters.role_desc}%` 
      });
    }

    if (filters?.valido !== undefined) {
      queryBuilder.andWhere('role.valido = :valido', { valido: filters.valido });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(role.role_name LIKE :search OR role.role_desc LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder.orderBy('role.id', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data: entities.map(this.mapToDomain),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: number): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByName(roleName: string): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({ 
      where: { role_name: roleName } 
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async create(roleData: ICreateRoleData): Promise<Role> {
    const entity = this.roleRepository.create(roleData);
    const savedEntity = await this.roleRepository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async update(id: number, roleData: IUpdateRoleData): Promise<Role | null> {
    const updateResult = await this.roleRepository.update(id, roleData);
    
    if (updateResult.affected === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const updateResult = await this.roleRepository.update(id, { valido: false });
    return updateResult.affected > 0;
  }

  async restore(id: number): Promise<boolean> {
    const updateResult = await this.roleRepository.update(id, { valido: true });
    return updateResult.affected > 0;
  }

  async hardDelete(id: number): Promise<boolean> {
    const deleteResult = await this.roleRepository.delete(id);
    return deleteResult.affected > 0;
  }

  async existsByName(roleName: string, excludeId?: number): Promise<boolean> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role')
      .where('role.role_name = :roleName', { roleName });

    if (excludeId) {
      queryBuilder.andWhere('role.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  async getStats(): Promise<IRoleStats> {
    const totalRoles = await this.roleRepository.count();
    const activeRoles = await this.roleRepository.count({ where: { valido: true } });
    const inactiveRoles = totalRoles - activeRoles;

    // Contar roles administrativos
    const administrativeRoles = await this.roleRepository.count({ 
      where: { 
        role_name: ILike('%administrador%'),
        valido: true 
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
      where: { valido: true },
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async findInactiveRoles(): Promise<Role[]> {
    const entities = await this.roleRepository.find({ 
      where: { valido: false },
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async searchByText(searchText: string): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      where: [
        { role_name: ILike(`%${searchText}%`) },
        { role_desc: ILike(`%${searchText}%`) }
      ],
      order: { id: 'ASC' }
    });
    return entities.map(this.mapToDomain);
  }

  async count(filters?: IRoleFilters): Promise<number> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters?.role_name) {
      queryBuilder.andWhere('role.role_name LIKE :role_name', { 
        role_name: `%${filters.role_name}%` 
      });
    }

    if (filters?.role_desc) {
      queryBuilder.andWhere('role.role_desc LIKE :role_desc', { 
        role_desc: `%${filters.role_desc}%` 
      });
    }

    if (filters?.valido !== undefined) {
      queryBuilder.andWhere('role.valido = :valido', { valido: filters.valido });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(role.role_name LIKE :search OR role.role_desc LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return queryBuilder.getCount();
  }

  /**
   * Mapea una entidad de infraestructura a una entidad de dominio
   */
  private mapToDomain(entity: RoleEntity): Role {
    return new Role(
      entity.id,
      entity.role_name,
      entity.role_desc,
      entity.valido,
    );
  }
}
