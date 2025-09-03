import {
  Injectable,
  NotFoundException,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, SelectQueryBuilder, In } from "typeorm";
import { UserEntity } from "../../../infrastructure/database/entities/user.entity";
import { UserWriteEntity } from "../../../infrastructure/database/entities/user-write.entity";
import { UsuarioRolEntity } from "../../../infrastructure/database/entities/usuario-rol.entity";
import { RoleEntity } from "../../../infrastructure/database/entities/role.entity";
import { CryptoService } from "../../../infrastructure/services/crypto.service";
import {
  IUserResponse,
  IUserStats,
  IUserFilters,
  IUserPayload,
  IUserBasicResponse,
  //} from '../user.interface';
} from "../user.interface";
import {
  PaginationDto,
  PaginatedResponseDto,
} from "../../application/dto/pagination.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserWriteEntity)
    private readonly userWriteRepository: Repository<UserWriteEntity>,
    @InjectRepository(UsuarioRolEntity)
    private readonly usuarioRolRepository: Repository<UsuarioRolEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly dataSource: DataSource,
    private readonly cryptoService: CryptoService
  ) {}

  /**
   * Obtiene todos los usuarios con paginación y filtros
   */
  async findAll(
    filters?: IUserFilters
  ): Promise<PaginatedResponseDto<IUserResponse>> {
    try {
      const { page = 1, limit = 10 } = filters || {};
      const skip = (page - 1) * limit;

      const queryBuilder = this.createQueryBuilder(filters);

      // Obtener total de registros
      const total = await queryBuilder.getCount();

      // Aplicar paginación
      const users = await queryBuilder.skip(skip).take(limit).getMany();

      const totalPages = Math.ceil(total / limit);

      const mappedUsers = await Promise.all(
        users.map((user) => this.mapToUserResponse(user, false)) // Sin contraseña para findAll
      );

      return {
        data: mappedUsers,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      this.logger.error("Error obteniendo usuarios:", error);
      throw error;
    }
  }

  // Nuevo método específico
  async findAllOnly(
    filters?: IUserFilters
  ): Promise<PaginatedResponseDto<IUserBasicResponse>> {
    try {
      const { page = 1, limit = 10 } = filters || {};
      const skip = (page - 1) * limit;

      // Query builder específico con campos limitados
      const queryBuilder = this.userRepository
        .createQueryBuilder("user")
        .select(["user.id", "user.nombre", "user.apellido", "user.cedula"]);

      // Aplicar filtros básicos
      if (filters?.active !== undefined) {
        queryBuilder.where("user.valido = :valido", {
          valido: filters.active ? true : false,
        });
      }

      if (filters?.search) {
        queryBuilder.andWhere(
          "(user.nombre LIKE :search OR user.apellido LIKE :search OR user.cedula LIKE :search)",
          { search: `%${filters.search}%` }
        );
      }

      const total = await queryBuilder.getCount();
      const users = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy("user.nombre", "DESC")
        .getMany();

      const totalPages = Math.ceil(total / limit);

      // Mapeo específico sin roles ni datos sensibles
      const mappedUsers = users.map((user) => ({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        cedula: user.cedula,
      }));

      return {
        data: mappedUsers,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      this.logger.error("Error obteniendo usuarios básicos:", error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async findOne(id: number): Promise<IUserResponse> {
    try {
      // Buscar usuario sin filtrar por valido para poder ver usuarios inactivos también
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return await this.mapToUserResponse(user, true); // Incluir contraseña para findOne
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
      // Buscar usuario sin filtrar por valido para poder ver usuarios inactivos también
      const user = await this.userRepository.findOne({
        where: { cedula },
      });

      if (!user) {
        throw new NotFoundException(
          `Usuario con cédula ${cedula} no encontrado`
        );
      }

      return await this.mapToUserResponse(user, true); // Incluir contraseña para findByCedula
    } catch (error) {
      this.logger.error(
        `Error obteniendo usuario por cédula ${cedula}:`,
        error
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
    currentUser?: IUserPayload
  ): Promise<IUserResponse> {
    try {
      // Buscar usuario en la tabla real
      const userWrite = await this.userWriteRepository.findOne({
        where: { id },
      });

      if (!userWrite) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Verificar permisos: Admin puede actualizar cualquier usuario, Usuario solo puede actualizar sus propios datos
      const isAdmin =
        currentUser?.rolesUsuario?.some((role) => role.id === 1) || false;

      if (currentUser && !isAdmin && currentUser.id !== id) {
        throw new UnauthorizedException(
          "No tienes permisos para actualizar este usuario"
        );
      }

      // Actualizar campos permitidos
      if (updateData.nombre) userWrite.nombre = updateData.nombre;
      if (updateData.apellido) userWrite.apellido = updateData.apellido;
      if (updateData.cedula) userWrite.cedula = updateData.cedula;

      // Manejar roles (array de objetos con id)
      if (updateData.roles && Array.isArray(updateData.roles)) {
        // Eliminar roles existentes
        await this.usuarioRolRepository.delete({ idUsuario: userWrite.id });

        // Agregar nuevos roles
        for (const role of updateData.roles) {
          if (role.id) {
            const newRole = this.usuarioRolRepository.create({
              idUsuario: userWrite.id,
              idRol: role.id,
              rowActive: true,
              userAdd: currentUser?.id || userWrite.id,
            });
            await this.usuarioRolRepository.save(newRole);
          }
        }
        this.logger.log(
          `Roles actualizados para usuario ${userWrite.id}: ${updateData.roles.map((r) => r.id).join(", ")}`
        );
      }

      // Manejar rol individual (para compatibilidad)
      if (updateData.role) {
        const existing = await this.usuarioRolRepository.findOne({
          where: { idUsuario: userWrite.id },
        });
        if (existing) {
          existing.idRol = updateData.role;
          existing.userMod = currentUser?.id || null;
          await this.usuarioRolRepository.save(existing);
        } else {
          const newLink = this.usuarioRolRepository.create({
            idUsuario: userWrite.id,
            idRol: updateData.role,
            rowActive: true,
            userAdd: currentUser?.id || userWrite.id,
          });
          await this.usuarioRolRepository.save(newLink);
        }
      }

      if (updateData.user_email) userWrite.user_email = updateData.user_email;
      if (updateData.telefono) userWrite.telefono = updateData.telefono;
      if (updateData.celular) userWrite.celular = updateData.celular;
      if (updateData.direccion) userWrite.direccion = updateData.direccion;

      // Manejar campo valida (restaurar usuario si se pone true)
      if (updateData.valido !== undefined) {
        userWrite.valido = Boolean(updateData.valido);

        // Si se está restaurando (valido: true), limpiar campos de soft delete
        if (updateData.valido === true) {
          userWrite.deleted_at = null;
          userWrite.deleted_by = null;
          this.logger.log(
            `Usuario ${userWrite.id} restaurado automáticamente via actualización`
          );
        }
      }
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
      if (updateData.password && updateData.password.trim() !== "") {
        let passwordHash;

        // Si ya es un hash (64 caracteres hexadecimales), usarlo directamente
        if (/^[a-f0-9]{64}$/i.test(updateData.password)) {
          passwordHash = updateData.password;
        } else {
          // Si es texto plano, generar el hash
          passwordHash = this.cryptoService.calculateSHA256(
            userWrite.cedula + updateData.password
          );
        }

        userWrite.password = passwordHash;
      }

      // Guardar cambios
      await this.userWriteRepository.save(userWrite);

      // Obtener datos actualizados desde la vista (sin filtrar por valido para poder obtener usuarios restaurados)
      const updatedUser = await this.userRepository.findOne({
        where: { id },
      });

      if (!updatedUser) {
        throw new NotFoundException("Error al obtener datos actualizados");
      }

      this.logger.log(`Usuario ${id} actualizado exitosamente`);
      return await this.mapToUserResponse(updatedUser, false); // Sin contraseña para update
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
    currentUser?: { id: number; role: number }
  ): Promise<{ message: string; user: any }> {
    try {
      // Buscar usuario en la tabla real
      const userWrite = await this.userWriteRepository.findOne({
        where: { id },
      });

      if (!userWrite) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Validaciones antes de eliminar
      await this.validateUserDeletion(userWrite, currentUser);

      // Soft delete (solo marcar como eliminado)
      userWrite.valido = false;
      userWrite.deleted_at = new Date();
      userWrite.deleted_by = currentUser?.id || 0;

      await this.userWriteRepository.save(userWrite);

      this.logger.log(
        `Usuario ${id} marcado como eliminado (soft delete) por ${currentUser?.id || "sistema"}`
      );

      return {
        message: "Usuario marcado como eliminado exitosamente",
        user: {
          id: userWrite.id,
          cedula: userWrite.cedula,
          nombre: userWrite.nombre,
          apellido: userWrite.apellido,
        },
      };
    } catch (error) {
      this.logger.error(`Error eliminando usuario ${id}:`, error);
      throw error;
    }
  }

  /**
   * Valida si un usuario puede ser eliminado
   */
  private async validateUserDeletion(
    user: UserWriteEntity,
    currentUser?: { id: number; role: number }
  ): Promise<void> {
    // Verificar si es el último administrador - obtener rol desde UsuariosRoles
    const usuarioRol = await this.usuarioRolRepository.findOne({
      where: { idUsuario: user.id, rowActive: true },
    });

    if (usuarioRol?.idRol === 1) {
      const adminCount = await this.usuarioRolRepository.count({
        where: { idRol: 1, rowActive: true },
      });

      if (adminCount <= 1) {
        throw new Error(
          "No se puede eliminar el último administrador del sistema"
        );
      }
    }

    // Verificar si el usuario actual está intentando eliminarse a sí mismo
    if (currentUser && currentUser.id === user.id) {
      throw new Error("No puedes eliminarte a ti mismo");
    }

    // Aquí podrías agregar más validaciones como:
    // - Verificar si tiene registros relacionados en otras tablas
    // - Verificar si tiene transacciones pendientes
    // - etc.
  }

  /**
   * Obtiene usuarios eliminados (soft delete)
   */
  async findDeleted(): Promise<IUserResponse[]> {
    try {
      const deletedUsers = await this.userWriteRepository.find({
        where: { valido: false },
        order: { deleted_at: "DESC" },
      });

      // Mapear usuarios eliminados usando el método estándar
      const mappedUsers = await Promise.all(
        deletedUsers.map((user) => this.mapToUserResponse(user, false)) // Sin contraseña para deleted
      );
      return mappedUsers;
    } catch (error) {
      this.logger.error("Error obteniendo usuarios eliminados:", error);
      throw error;
    }
  }

  /**
   * Busca usuarios por término
   */
  async searchByTerm(term: string): Promise<IUserResponse[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder("user")
        .where("user.valido = :valido", { valido: true })
        .andWhere(
          "(user.nombre LIKE :term OR user.apellido LIKE :term OR user.cedula LIKE :term)",
          { term: `%${term}%` }
        )
        .orderBy("user.nombre", "DESC")
        .getMany();

      return await Promise.all(
        users.map((user) => this.mapToUserResponse(user, false))
      );
    } catch (error) {
      this.logger.error(
        `Error buscando usuarios con término "${term}":`,
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene usuarios por rol
   */
  async findByRole(role: number): Promise<IUserResponse[]> {
    try {
      // Buscar usuarios por rol desde UsuariosRoles
      const usuariosRoles = await this.usuarioRolRepository.find({
        where: { idRol: role, rowActive: true },
      });

      const userIds = usuariosRoles.map((ur) => ur.idUsuario);

      if (userIds.length === 0) {
        return [];
      }

      const users = await this.userRepository.find({
        where: { id: In(userIds), valido: true },
        order: { nombre: "DESC" },
      });

      return await Promise.all(
        users.map((user) => this.mapToUserResponse(user, false))
      );
    } catch (error) {
      this.logger.error(`Error obteniendo usuarios por rol ${role}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene usuarios por división
   */
  async findByDivision(division: string): Promise<IUserResponse[]> {
    // Temporalmente deshabilitado - campo division no existe en Appusuarios
    return [];
    /*
    try {
      const users = await this.userRepository.find({
        where: { division, valido: true },
        order: { nombre: 'DESC' },

      });

      return await Promise.all(users.map(user => this.mapToUserResponse(user, false)));
    } catch (error) {
      this.logger.error(
        `Error obteniendo usuarios por división ${division}:`,
        error,
      );
      throw error;
    }
    */
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  async getStats(): Promise<IUserStats> {
    try {
      const totalUsers = await this.userRepository.count({
        where: { valido: true },
      });

      // Temporalmente deshabilitado - el rol se obtiene desde UsuariosRoles
      // const usersByRole = await this.userRepository
      //   .createQueryBuilder('user')
      //   .select('user.role', 'role')
      //   .addSelect('COUNT(*)', 'count')
      //   .where('user.valido = :valido', { valido: true })
      //   .groupBy('user.role')
      //   .getRawMany();
      const usersByRole = [];

      // Temporalmente deshabilitado - campo division no existe en Appusuarios
      // const usersByDivision = await this.userRepository
      //   .createQueryBuilder('user')
      //   .select('user.division', 'division')
      //   .addSelect('COUNT(*)', 'count')
      //   .where('user.valido = :valido', { valido: true })
      //   .groupBy('user.division')
      //   .getRawMany();

      return {
        totalUsers,
        usersByRole: usersByRole.map((item) => ({
          role: item.role,
          count: parseInt(item.count),
        })),
        usersByDivision: [], // Temporalmente vacío
      };
    } catch (error) {
      this.logger.error("Error obteniendo estadísticas de usuarios:", error);
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
        error
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
        throw new UnauthorizedException(
          "Cédula, clave y teléfono son requeridos"
        );
      }

      // Generar el hash de la contraseña (cedula + clave)
      const passwordHash = this.cryptoService.calculateSHA256(cedula + clave);

      // Buscar usuario en la tabla real usando cédula y hash de contraseña
      const user = await this.userWriteRepository.findOne({
        where: {
          cedula,
          password: passwordHash,
          valido: true,
        },
      });

      if (!user) {
        this.logger.warn(`Credenciales inválidas para cédula: ${cedula}`);
        throw new UnauthorizedException("Credenciales inválidas");
      }

      // Actualizar el número de teléfono
      user.telefono = telefono;

      await this.userWriteRepository.save(user);

      this.logger.log(`Teléfono actualizado para usuario: ${cedula}`);

      return {
        success: true,
        message: "Teléfono actualizado exitosamente",
        user: {
          id: user.id,
          cedula: user.cedula,
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: telefono,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error actualizando teléfono para usuario ${cedula}:`,
        error
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException("Error interno del servidor");
    }
  }

  /**
   * Crea el query builder base con filtros
   */
  private createQueryBuilder(
    filters?: IUserFilters
  ): SelectQueryBuilder<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    // Filtro por validez del usuario
    // COMPORTAMIENTO POR DEFECTO: traer TODOS los usuarios (activos e inactivos)
    // Solo filtrar si se especifica explícitamente el parámetro active
    if (filters?.active !== undefined) {
      queryBuilder.where("user.valido = :valido", {
        valido: filters.active ? true : false, // Convertir explícitamente a booleano
      });
      this.logger.log(`Aplicando filtro de usuario activo: ${filters.active}`);
    } else {
      // SIN FILTROS - Mostrar TODOS los usuarios por defecto
      this.logger.log(
        "Sin filtro de valido - mostrando todos los usuarios (activos e inactivos)"
      );
    }

    // Temporalmente deshabilitado - el rol se obtiene desde UsuariosRoles
    // if (filters?.role) {
    //   queryBuilder.andWhere('user.role = :role', {
    //     role: filters.role,
    //   });
    // }

    // Temporalmente deshabilitado - campo division no existe en Appusuarios
    // if (filters?.division) {
    //   queryBuilder.andWhere('user.division = :division', {
    //     division: filters.division,
    //   });
    // }

    if (filters?.search) {
      queryBuilder.andWhere(
        "(user.nombre LIKE :search OR user.apellido LIKE :search OR user.cedula LIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    return queryBuilder.orderBy("user.nombre", "DESC");
  }

  /**
   * Mapea la entidad User a IUserResponse con estructura completa
   */
  private async mapToUserResponse(
    user: UserEntity,
    includePassword: boolean = false
  ): Promise<IUserResponse> {
    // Obtener todos los roles del usuario desde UsuariosRoles
    const usuariosRoles = await this.usuarioRolRepository.find({
      where: { idUsuario: user.id, rowActive: true },
      relations: ["roleEntity"],
    });

    // Construir array de roles
    const roles = usuariosRoles.map((ur) => ({
      id: ur.roleEntity.id,
      roleName: ur.roleEntity.roleName,
    }));

    // Obtener rol principal (primer rol o por defecto)
    const rolePrincipal = roles.length > 0 ? roles[0].roleName : "Usuario";

    // Obtener datos adicionales de la tabla de escritura si se necesita la contraseña
    let password: string | undefined;
    let telefono: string | undefined;
    let celular: string | undefined;
    let direccion: string | undefined;

    if (includePassword || true) {
      // Siempre obtener datos completos
      const userWrite = await this.userWriteRepository.findOne({
        where: { id: user.id },
      });

      if (userWrite) {
        if (includePassword) {
          password = userWrite.password;
        }
        telefono = userWrite.telefono;
        celular = userWrite.celular;
        direccion = userWrite.direccion;
      }
    }

    return {
      id: user.id,
      fullname: user.getFullName(), // Combinar nombre + apellido
      apellido: user.apellido,
      nombre: user.nombre,
      cedula: user.cedula,
      roles: roles,
      // password: password,
      // role: rolePrincipal, // Activar rol principal
      user_email: user.user_email,
      telefono: telefono,
      celular: celular,
      direccion: direccion,
      valido: Boolean(user.valido),
    };
  }
}
