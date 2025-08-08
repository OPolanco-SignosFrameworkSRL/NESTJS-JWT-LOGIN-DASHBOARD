import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../core/domain/repositories/user.repository.interface';
import { User } from '../../core/domain/entities/user.entity';
import { UserEntity } from '../database/entities/user.entity';
import { UserWriteEntity } from '../database/entities/user-write.entity';
import { IUserFilters, IUserStats, UserRole } from '../../core/domain/interfaces/user.interface';

/**
 * Implementación del repositorio de usuarios
 * Maneja el acceso a datos de usuarios en la base de datos
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userReadRepository: Repository<UserEntity>,
    @InjectRepository(UserWriteEntity)
    private readonly userWriteRepository: Repository<UserWriteEntity>,
  ) {}

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private mapToDomain(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.cedula,
      userEntity.nombre,
      userEntity.apellido,
      userEntity.role as UserRole,
      userEntity.user_email,
      userEntity.telefono,
      userEntity.valido === '1',
      userEntity.division,
      userEntity.cargo,
      userEntity.dependencia,
      userEntity.recinto,
      userEntity.estado,
    );
  }

  /**
   * Encuentra todos los usuarios con filtros opcionales
   */
  async findAll(filters?: IUserFilters): Promise<User[]> {
    const query = this.userReadRepository.createQueryBuilder('user');

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.division) {
      query.andWhere('user.division = :division', { division: filters.division });
    }

    if (filters?.search) {
      query.andWhere(
        '(user.nombre LIKE :search OR user.apellido LIKE :search OR user.cedula LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    if (filters?.offset) {
      query.offset(filters.offset);
    }

    const users = await query.getMany();
    return users.map(user => this.mapToDomain(user));
  }

  /**
   * Encuentra un usuario por ID
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.userReadRepository.findOne({ where: { id } });
    return user ? this.mapToDomain(user) : null;
  }

  /**
   * Encuentra un usuario por cédula
   */
  async findByCedula(cedula: string): Promise<User | null> {
    const user = await this.userReadRepository.findOne({ where: { cedula } });
    return user ? this.mapToDomain(user) : null;
  }

  /**
   * Encuentra usuarios por rol
   */
  async findByRole(role: string): Promise<User[]> {
    const users = await this.userReadRepository.find({ where: { role } });
    return users.map(user => this.mapToDomain(user));
  }

  /**
   * Encuentra usuarios por división
   */
  async findByDivision(division: string): Promise<User[]> {
    const users = await this.userReadRepository.find({ where: { division } });
    return users.map(user => this.mapToDomain(user));
  }

  /**
   * Busca usuarios por término
   */
  async searchByTerm(term: string): Promise<User[]> {
    const users = await this.userReadRepository
      .createQueryBuilder('user')
      .where(
        'user.nombre LIKE :term OR user.apellido LIKE :term OR user.cedula LIKE :term',
        { term: `%${term}%` }
      )
      .getMany();

    return users.map(user => this.mapToDomain(user));
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData: any): Promise<User> {
    const newUser = this.userWriteRepository.create(userData);
    await this.userWriteRepository.save(newUser);
    
    // Obtener el usuario creado desde la vista de lectura usando la cédula
    const createdUser = await this.userReadRepository.findOne({ 
      where: { cedula: userData.cedula } 
    });
    
    return this.mapToDomain(createdUser!);
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: number, userData: any): Promise<User> {
    await this.userWriteRepository.update(id, userData);
    
    // Obtener el usuario actualizado desde la vista de lectura
    const updatedUser = await this.userReadRepository.findOne({ where: { id } });
    return this.mapToDomain(updatedUser!);
  }

  /**
   * Elimina un usuario (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.userWriteRepository.update(id, { valido: '0' });
  }

  /**
   * Restaura un usuario eliminado
   */
  async restore(id: number): Promise<User> {
    await this.userWriteRepository.update(id, { valido: '1' });
    
    const restoredUser = await this.userReadRepository.findOne({ where: { id } });
    return this.mapToDomain(restoredUser!);
  }

  /**
   * Encuentra usuarios eliminados
   */
  async findDeleted(): Promise<User[]> {
    const users = await this.userReadRepository.find({ where: { valido: '0' } });
    return users.map(user => this.mapToDomain(user));
  }

  /**
   * Verifica si existe un usuario con la cédula dada
   */
  async exists(cedula: string): Promise<boolean> {
    const user = await this.userWriteRepository.findOne({ where: { cedula } });
    return !!user;
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  async getStats(): Promise<IUserStats> {
    const total = await this.userReadRepository.count();
    const active = await this.userReadRepository.count({ where: { valido: '1' } });
    const inactive = await this.userReadRepository.count({ where: { valido: '0' } });

    // Estadísticas por rol
    const roleStats = await this.userReadRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const byRole: Record<UserRole, number> = {
      Admin: 0,
      Usuario: 0,
      Supervisor: 0,
      Manager: 0,
      Administrator: 0,
    };

    roleStats.forEach(stat => {
      byRole[stat.role as UserRole] = parseInt(stat.count);
    });

    // Estadísticas por división
    const divisionStats = await this.userReadRepository
      .createQueryBuilder('user')
      .select('user.division', 'division')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.division')
      .getRawMany();

    const byDivision: Record<string, number> = {};
    divisionStats.forEach(stat => {
      byDivision[stat.division] = parseInt(stat.count);
    });

    return {
      total,
      active,
      inactive,
      byRole,
      byDivision,
    };
  }

  /**
   * Actualiza el teléfono de un usuario
   */
  async updatePhone(cedula: string, telefono: string): Promise<User> {
    await this.userWriteRepository.update({ cedula }, { telefono });
    
    const updatedUser = await this.userReadRepository.findOne({ where: { cedula } });
    return this.mapToDomain(updatedUser!);
  }
} 