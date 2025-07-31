import { Injectable, NotFoundException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../../infrastructure/database/entities/user-write.entity';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import {
  IUserResponse,
  IUserStats,
  IUserFilters,
  IUserUpdateData,
  UserRole,
} from '../../domain/interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserWriteEntity)
    private readonly userWriteRepository: Repository<UserWriteEntity>,
    private readonly dataSource: DataSource,
    private readonly cryptoService: CryptoService,
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
        where: { id, valido: '1' },
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
        where: { cedula, valido: '1' },
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
   * Actualiza un usuario en la tabla real y retorna los datos actualizados desde la vista
   */
  async update(
    id: number,
    updateData: IUserUpdateData,
    currentUser?: { id: number; role: UserRole },
  ): Promise<IUserResponse> {
    try {
      // Buscar usuario en la tabla real
      const userWrite = await this.userWriteRepository.findOne({
        where: { id }
      });

      if (!userWrite) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Verificar permisos: Admin puede actualizar cualquier usuario, Usuario solo puede actualizar sus propios datos
      if (currentUser && currentUser.role !== UserRole.Admin && currentUser.id !== id) {
        throw new UnauthorizedException('No tienes permisos para actualizar este usuario');
      }

      // Actualizar campos permitidos
      if (updateData.nombre) userWrite.nombre = updateData.nombre;
      if (updateData.apellido) userWrite.apellido = updateData.apellido;
      if (updateData.role) userWrite.role = updateData.role;
      if (updateData.user_email) userWrite.user_email = updateData.user_email;
      if (updateData.telefono) userWrite.telefono = updateData.telefono;
      if (updateData.direccion) userWrite.direccion = updateData.direccion;
      if (updateData.celular) userWrite.celular = updateData.celular;
      if (updateData.user_status) userWrite.user_status = updateData.user_status;
      if (updateData.caja_id !== undefined) userWrite.caja_id = updateData.caja_id;
      if (updateData.tienda_id !== undefined) userWrite.tienda_id = updateData.tienda_id;
      if (updateData.allow_multi_tienda !== undefined) userWrite.allow_multi_tienda = updateData.allow_multi_tienda;
      if (updateData.max_descuento !== undefined) userWrite.max_descuento = updateData.max_descuento;
      if (updateData.close_caja !== undefined) userWrite.close_caja = updateData.close_caja;
      if (updateData.user_account_email) userWrite.user_account_email = updateData.user_account_email;
      if (updateData.user_account_email_passw) userWrite.user_account_email_passw = updateData.user_account_email_passw;
      if (updateData.comision_porciento !== undefined) userWrite.comision_porciento = updateData.comision_porciento;
      if (updateData.default_portalid !== undefined) userWrite.default_portalid = updateData.default_portalid;
      if (updateData.nuevocampo) userWrite.nuevocampo = updateData.nuevocampo;
      if (updateData.encargadoId !== undefined) userWrite.encargadoId = updateData.encargadoId;
      if (updateData.valido !== undefined) userWrite.valido = updateData.valido;

      // Guardar cambios
      await this.userWriteRepository.save(userWrite);

      // Obtener datos actualizados desde la vista
      const updatedUser = await this.userRepository.findOne({
        where: { id, valido: '1' }
      });

      if (!updatedUser) {
        throw new NotFoundException('Error al obtener datos actualizados');
      }

      this.logger.log(`Usuario ${id} actualizado exitosamente`);
      return this.mapToUserResponse(updatedUser);
    } catch (error) {
      this.logger.error(`Error actualizando usuario ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un usuario (soft delete)
   */
  async remove(id: number): Promise<void> {
    try {
      // Buscar usuario en la tabla real
      const userWrite = await this.userWriteRepository.findOne({
        where: { id }
      });

      if (!userWrite) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Eliminación física real
      await this.userWriteRepository.remove(userWrite);

      this.logger.log(`Usuario ${id} eliminado permanentemente de la base de datos`);
    } catch (error) {
      this.logger.error(`Error eliminando usuario ${id}:`, error);
      throw error;
    }
  }





  /**
   * Busca usuarios por término
   */
  async searchByTerm(term: string): Promise<IUserResponse[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.valido = :valido', { valido: '1' })
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
        where: { role: role as string, valido: '1' },
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
        where: { division, valido: '1' },
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
        where: { valido: '1' },
      });

      const usersByRole = await this.userRepository
        .createQueryBuilder('user')
        .select('user.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .where('user.valido = :valido', { valido: '1' })
        .groupBy('user.role')
        .getRawMany();

      const usersByDivision = await this.userRepository
        .createQueryBuilder('user')
        .select('user.division', 'division')
        .addSelect('COUNT(*)', 'count')
        .where('user.valido = :valido', { valido: '1' })
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
        where: { cedula, valido: '1' },
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
   * Busca un usuario por cédula y contraseña, y actualiza su teléfono si existe.
   * La contraseña se valida usando el hash SHA-256 de (cedula + clave).
   */
  async updateUserPhone(
    cedula: string, 
    clave: string, 
    telefono: string
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      if (!cedula || !clave || !telefono) {
        throw new UnauthorizedException('Cédula, clave y teléfono son requeridos');
      }

      // Generar el hash de la contraseña (cedula + clave)
      const passwordHash = this.cryptoService.calculateSHA256(cedula + clave);

      // Buscar usuario en la tabla real usando cédula y hash de contraseña
      const user = await this.userWriteRepository.findOne({
        where: { 
          cedula,
          password: passwordHash,
          valido: '1' 
        },
      });

      if (!user) {
        this.logger.warn(`Credenciales inválidas para cédula: ${cedula}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Actualizar el número de teléfono
      user.telefono = telefono;
      
      await this.userWriteRepository.save(user);

      this.logger.log(`Teléfono actualizado para usuario: ${cedula}`);

      return {
        success: true,
        message: 'Teléfono actualizado exitosamente',
        user: {
          id: user.id,
          cedula: user.cedula,
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: telefono,
        }
      };

    } catch (error) {
      this.logger.error(`Error actualizando teléfono para usuario ${cedula}:`, error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Error interno del servidor');
    }
  }

  /**
   * Crea el query builder base con filtros
   */
  private createQueryBuilder(filters?: IUserFilters): SelectQueryBuilder<UserEntity> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.valido = :valido', { valido: '1' });

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
  private mapToUserResponse(user: UserEntity): IUserResponse {
    return {
      id: user.id,
      cedula: user.cedula,
      nombre: user.nombre,
      apellido: user.apellido,
      fullname: user.getFullName(),
      role: user.role as UserRole,
      user_email: user.user_email,
      telefono: user.telefono,
      direccion: '',
      celular: '',
      user_status: 1,
      caja_id: '',
      tienda_id: '',
      allow_multi_tienda: '0',
      max_descuento: '',
      close_caja: '0',
      user_account_email: '',
      comision_porciento: '',
      default_portalid: '',
      nuevocampo: '',
      encargadoId: '',
      valido: user.valido,
    };
  }
}