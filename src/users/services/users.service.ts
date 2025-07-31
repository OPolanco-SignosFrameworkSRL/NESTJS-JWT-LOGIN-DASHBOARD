import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../entities/user.entity';
import {
  IUserResponse,
  IUserStats,
  IUserFilters,
  IUserUpdateData,
  UserRole,
} from '../../common/interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Obtiene todos los usuarios activos
   */
  async findAll(filters?: IUserFilters): Promise<IUserResponse[]> {
    try {
      const queryBuilder = this.createQueryBuilder(filters);
      const users = await queryBuilder.getMany();
      return users.map(user => this.mapToUserResponse(user));
    } catch (error) {
      this.logger.error('Error obteniendo usuarios:', error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async findOne(id: number): Promise<IUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, valido: true },
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      this.logger.error(`Error obteniendo usuario ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por cédula
   */
  async findByCedula(cedula: string): Promise<IUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { cedula, valido: true },
      });

      if (!user) {
        throw new NotFoundException(
          `Usuario con cédula ${cedula} no encontrado`,
        );
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      this.logger.error(
        `Error obteniendo usuario por cédula ${cedula}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Actualiza un usuario
   * NOTA: Esta funcionalidad está deshabilitada porque vappusuarios es una vista de solo lectura
   */
  async update(
    _id: number,
    _updateData: IUserUpdateData,
  ): Promise<IUserResponse> {
    throw new Error(
      'La actualización de usuarios está deshabilitada. vappusuarios es una vista de solo lectura.',
    );
  }

  /**
   * Elimina un usuario (soft delete)
   * NOTA: Esta funcionalidad está deshabilitada porque vappusuarios es una vista de solo lectura
   */
  async remove(_id: number): Promise<void> {
    throw new Error(
      'La eliminación de usuarios está deshabilitada. vappusuarios es una vista de solo lectura.',
    );
  }

  /**
   * Busca usuarios por término
   */
  async searchByTerm(term: string): Promise<IUserResponse[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.valido = :valido', { valido: true })
        .andWhere(
          '(user.nombre LIKE :term OR user.apellido LIKE :term OR user.cedula LIKE :term)',
          { term: `%${term}%` },
        )
        .orderBy('user.nombre', 'ASC')
        .getMany();

      return users.map(user => this.mapToUserResponse(user));
    } catch (error) {
      this.logger.error(
        `Error buscando usuarios con término "${term}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * Obtiene usuarios por rol
   */
  async findByRole(role: UserRole): Promise<IUserResponse[]> {
    try {
      const users = await this.userRepository.find({
        where: { role: role as string, valido: true },
        order: { nombre: 'ASC' },
      });

      return users.map(user => this.mapToUserResponse(user));
    } catch (error) {
      this.logger.error(`Error obteniendo usuarios por rol ${role}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene usuarios por división
   */
  async findByDivision(division: string): Promise<IUserResponse[]> {
    try {
      const users = await this.userRepository.find({
        where: { division, valido: true },
        order: { nombre: 'ASC' },
      });

      return users.map(user => this.mapToUserResponse(user));
    } catch (error) {
      this.logger.error(
        `Error obteniendo usuarios por división ${division}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  async getStats(): Promise<IUserStats> {
    try {
      const totalUsers = await this.userRepository.count({
        where: { valido: true },
      });

      const usersByRole = await this.userRepository
        .createQueryBuilder('user')
        .select('user.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .where('user.valido = :valido', { valido: true })
        .groupBy('user.role')
        .getRawMany();

      const usersByDivision = await this.userRepository
        .createQueryBuilder('user')
        .select('user.division', 'division')
        .addSelect('COUNT(*)', 'count')
        .where('user.valido = :valido', { valido: true })
        .groupBy('user.division')
        .getRawMany();

      return {
        totalUsers,
        usersByRole,
        usersByDivision,
      };
    } catch (error) {
      this.logger.error('Error obteniendo estadísticas de usuarios:', error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario existe
   */
  async exists(cedula: string): Promise<boolean> {
    try {
      const count = await this.userRepository.count({
        where: { cedula, valido: true },
      });
      return count > 0;
    } catch (error) {
      this.logger.error(
        `Error verificando existencia de usuario ${cedula}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Crea el query builder base con filtros
   */
  private createQueryBuilder(filters?: IUserFilters): SelectQueryBuilder<User> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.valido = :valido', { valido: true });

    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', {
        role: filters.role as string,
      });
    }

    if (filters?.division) {
      queryBuilder.andWhere('user.division = :division', {
        division: filters.division,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(user.nombre LIKE :search OR user.apellido LIKE :search OR user.cedula LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.active !== undefined) {
      queryBuilder.andWhere('user.estado = :estado', {
        estado: filters.active ? 'ACTIVO' : 'INACTIVO',
      });
    }

    return queryBuilder.orderBy('user.nombre', 'ASC');
  }

  /**
   * Mapea la entidad User a IUserResponse
   */
  private mapToUserResponse(user: User): IUserResponse {
    return {
      id: user.id,
      cedula: user.cedula,
      fullname: user.getFullName(),
      apellido: user.apellido,
      role: user.role as UserRole,
      user_email: user.user_email,
      division: user.division,
      cargo: user.cargo,
      dependencia: user.dependencia,
      recinto: user.recinto,
      estado: user.estado,
    };
  }
}
