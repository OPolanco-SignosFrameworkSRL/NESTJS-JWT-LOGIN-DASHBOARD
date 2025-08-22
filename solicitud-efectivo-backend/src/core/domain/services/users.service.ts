import { Injectable, NotFoundException, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../../../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../../../infrastructure/database/entities/user-write.entity';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import {
  IUserResponse,
  IUserStats,
  IUserFilters,
  IUserUpdateData,
  UserRole,
  //} from '../user.interface';
} from '../interfaces/user.interface';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

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
  ) { }

  /**
   * Obtiene todos los usuarios activos con paginación
   */
  async findAll(filters?: IUserFilters): Promise<PaginatedResponseDto<IUserResponse>> {
    try {
      const { page = 1, limit = 10, ...otherFilters } = filters || {};
      const skip = (page - 1) * limit;

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where('user.valido = :valido', { valido: '1' });

      if (otherFilters?.role) {
        queryBuilder.andWhere('user.role = :role', { role: otherFilters.role });
      }

      if (otherFilters?.division) {
        queryBuilder.andWhere('user.division = :division', { division: otherFilters.division });
      }

      if (otherFilters?.search) {
        queryBuilder.andWhere(
          '(user.nombre LIKE :search OR user.apellido LIKE :search OR user.cedula LIKE :search)',
          { search: `%${otherFilters.search}%` }
        );
      }

      // Obtener total de registros
      const total = await queryBuilder.getCount();

      // Aplicar paginación
      const users = await queryBuilder
        .orderBy('user.nombre', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      const totalPages = Math.ceil(total / limit);

      return {
        data: users.map(user => this.mapToUserResponse(user)),
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
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

      return this.mapToUserResponseWithNames(user);
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
     //updateData: IUserUpdateData,
    updateData: any,
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
      //if (currentUser && currentUser.role !== UserRole.Admin && currentUser.id !== id) {
      if (currentUser && currentUser.role !== 'Admin' && currentUser.id !== id) {
        throw new UnauthorizedException('No tienes permisos para actualizar este usuario');
      }

      // Actualizar campos permitidos
      if (updateData.nombre) userWrite.nombre = updateData.nombre;
      if (updateData.apellido) userWrite.apellido = updateData.apellido;
      if (updateData.cedula) userWrite.cedula = updateData.cedula;
      if (updateData.role) userWrite.role = updateData.role;
      if (updateData.user_email) userWrite.user_email = updateData.user_email;
      if (updateData.telefono) userWrite.telefono = updateData.telefono;
      if (updateData.celular) userWrite.celular = updateData.celular;
      if (updateData.direccion) userWrite.direccion = updateData.direccion;
      /*
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
      
      // Manejar cedula y password de manera coordinada
      if (updateData.cedula) {
        const oldCedula = userWrite.cedula;
        userWrite.cedula = updateData.cedula;
        
        // Si se cambió la cédula pero NO se proporcionó nueva contraseña,
        // necesitamos regenerar el hash con la nueva cédula
        if (!updateData.password) {
          // Aquí necesitaríamos la contraseña original, pero no la tenemos
          // Por seguridad, requerimos que cuando se cambie la cédula, también se proporcione la contraseña
          throw new BadRequestException('Cuando se actualiza la cédula, se debe proporcionar también la contraseña');
        }
      }
      // Actualizar contraseña solo si se proporciona
      if (updateData.password) {

      // Actualizar contraseña solo si se proporciona y no está vacía
      if (updateData.password && updateData.password.trim() !== '') {
        // Generar hash de la contraseña (cedula + clave)
        const passwordHash = this.cryptoService.calculateSHA256(userWrite.cedula + updateData.password);
        userWrite.password = passwordHash;
      }
      */
/*  // Actualizar contraseña solo si se proporciona y no está vacía
 if (updateData.password && updateData.password.trim() !== '') {
  let passwordHash;
  
  // Si ya es un hash (64 caracteres hexadecimales), usarlo directamente
  if (/^[a-f0-9]{64}$/i.test(updateData.password)) {
    passwordHash = updateData.password;
  } else {
    // Si es texto plano, generar el hash
    passwordHash = this.cryptoService.calculateSHA256(userWrite.cedula + updateData.password);
  }
  
  userWrite.password = passwordHash;
}
      
      // Actualizar contraseña solo si se proporciona y no está vacía
      if (updateData.password && updateData.password.trim() !== '') {
        // Generar hash de la contraseña (cedula + clave)
        const passwordHash = this.cryptoService.calculateSHA256(userWrite.cedula + updateData.password); */
      // VERSIÓN FUNCIONAL - Actualizar contraseña solo si se proporciona y no está vacía
      if (updateData.password && updateData.password.trim() !== '') {
        let passwordHash;
        
        // Si ya es un hash (64 caracteres hexadecimales), usarlo directamente
        if (/^[a-f0-9]{64}$/i.test(updateData.password)) {
          passwordHash = updateData.password;
        } else {
          // Si es texto plano, generar el hash
          passwordHash = this.cryptoService.calculateSHA256(userWrite.cedula + updateData.password);
        }
        
        userWrite.password = passwordHash;
      }

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
   * Elimina un usuario (solo soft delete)
   */
  async remove(
    id: number,
    /*  currentUser?: { id: number; role: UserRole },
    confirmPermanentDelete: boolean = false,
    reason?: string
  ): Promise<{ message: string; type: 'soft' | 'permanent'; user: any }> { */
    currentUser?: { id: number; role: UserRole }
  ): Promise<{ message: string; user: any }> {
    try {
      // Buscar usuario en la tabla real
      const userWrite = await this.userWriteRepository.findOne({
        where: { id }
      });

      if (!userWrite) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Validaciones antes de eliminar
      await this.validateUserDeletion(userWrite, currentUser);

      // Soft delete (solo marcar como eliminado)
      userWrite.valido = '0';
      userWrite.deleted_at = new Date();
      userWrite.deleted_by = currentUser?.id || null;

      await this.userWriteRepository.save(userWrite);

      this.logger.log(`Usuario ${id} marcado como eliminado (soft delete) por ${currentUser?.id || 'sistema'}`);

      return {
        message: 'Usuario marcado como eliminado exitosamente',
        user: { 
          id: userWrite.id, 
          cedula: userWrite.cedula, 
          nombre: userWrite.nombre, 
          apellido: userWrite.apellido 
        }
      };
    } catch (error) {
      this.logger.error(`Error eliminando usuario ${id}:`, error);
      throw error;
    }
  }

  /**
   * Valida si un usuario puede ser eliminado
   */
  private async validateUserDeletion(user: UserWriteEntity, currentUser?: { id: number; role: UserRole }): Promise<void> {
    // Verificar si es el último administrador
    if (user.role === 'Admin') {
      const adminCount = await this.userWriteRepository.count({
        where: { role: 'Admin', valido: '1' }
      });

      if (adminCount <= 1) {
        throw new Error('No se puede eliminar el último administrador del sistema');
      }
    }

    // Verificar si el usuario actual está intentando eliminarse a sí mismo
    if (currentUser && currentUser.id === user.id) {
      throw new Error('No puedes eliminarte a ti mismo');
    }

    // Aquí podrías agregar más validaciones como:
    // - Verificar si tiene registros relacionados en otras tablas
    // - Verificar si tiene transacciones pendientes
    // - etc.
  }

  /**
   * Restaura un usuario eliminado (soft delete)
   */
  async restore(id: number, currentUser?: { id: number; role: UserRole }): Promise<{ message: string; user: any }> {
    try {
      const userWrite = await this.userWriteRepository.findOne({
        where: { id }
      });

      if (!userWrite) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      if (userWrite.valido === '1') {
        throw new BadRequestException('El usuario ya está activo');
      }

      // Restaurar usuario
      userWrite.valido = '1';
      userWrite.deleted_at = null;
      userWrite.deleted_by = null;

      await this.userWriteRepository.save(userWrite);

      this.logger.log(`Usuario ${id} restaurado por ${currentUser?.id || 'sistema'}`);

      return {
        message: 'Usuario restaurado exitosamente',
        user: { id: userWrite.id, cedula: userWrite.cedula, nombre: userWrite.nombre, apellido: userWrite.apellido }
      };
    } catch (error) {
      this.logger.error(`Error restaurando usuario ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene usuarios eliminados (soft delete)
   */
  async findDeleted(): Promise<IUserResponse[]> {
    try {
      const deletedUsers = await this.userWriteRepository.find({
        where: { valido: '0' },
        order: { deleted_at: 'DESC' }
      });

      return deletedUsers.map(user => ({
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        fullname: user.getFullName(),
        role: user.role as UserRole,
        user_email: user.user_email,
        telefono: user.telefono,
        direccion: user.direccion,
        celular: user.celular,
        /*
        user_status: user.user_status,
        caja_id: user.caja_id,
        tienda_id: user.tienda_id,
        allow_multi_tienda: user.allow_multi_tienda,
        max_descuento: user.max_descuento,
        close_caja: user.close_caja,
        user_account_email: user.user_account_email,
        comision_porciento: user.comision_porciento,
        default_portalid: user.default_portalid,
        nuevocampo: user.nuevocampo,
        encargadoId: user.encargadoId,
        valido: user.valido,
        deleted_at: user.deleted_at,
        deleted_by: user.deleted_by
        */
        valido: user.valido === '1'
      }));
    } catch (error) {
      this.logger.error('Error obteniendo usuarios eliminados:', error);
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
        .orderBy('user.nombre', 'DESC')
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
        order: { nombre: 'DESC' },
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
        order: { nombre: 'DESC' },
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
        /*
        totalUsers,
        usersByRole,
        usersByDivision,
        */
        total: totalUsers,
        active: totalUsers, // Simplificación - todos los usuarios obtenidos están activos
        inactive: 0,
        byRole: usersByRole.reduce((acc, item) => ({ ...acc, [item.role]: parseInt(item.count) }), {} as Record<UserRole, number>),
        byDivision: usersByDivision.reduce((acc, item) => ({ ...acc, [item.division]: parseInt(item.count) }), {} as Record<string, number>),
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

    return queryBuilder.orderBy('user.nombre', 'DESC');
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
      /*
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
      telefono: user.telefono,
      direccion: user.direccion,
      celular: user.celular,
      */
      valido: user.valido === '1',
    };
  }

  private mapToUserResponseWithNames(user: UserEntity): IUserResponse {
    return {
      id: user.id,
      cedula: user.cedula,
      nombre: user.nombre,
      apellido: user.apellido,
      //fullname: user.getFullName(),
      role: user.role as UserRole,
      user_email: user.user_email,
      telefono: user.telefono,
      direccion: user.direccion,
      celular: user.celular,
      valido: user.valido === '1',
    };
  }
}