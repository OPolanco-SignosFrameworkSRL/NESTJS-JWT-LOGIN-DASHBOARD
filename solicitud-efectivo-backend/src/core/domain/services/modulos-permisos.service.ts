import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { ModuloPermisoRepository } from '../../../infrastructure/repositories/modulo-permiso.repository';
import { ModuloRepository } from '../../../infrastructure/repositories/modulo.repository';
import { RolesPermisosRepository } from '../../../infrastructure/repositories/roles-permisos.repository';
import { 
  IModuloPermiso, 
  IModuloPermisoCreateData, 
  IModuloPermisoUpdateData, 
  IModuloPermisoResponse, 
  IModuloPermisoFilters 
} from '../modulos-permisos.interface';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class ModulosPermisosService {
  private readonly logger = new Logger(ModulosPermisosService.name);

  constructor(
    private readonly moduloPermisoRepository: ModuloPermisoRepository,
    private readonly moduloRepository: ModuloRepository,
    private readonly rolesPermisosRepository: RolesPermisosRepository,
  ) {}

  /**
   * Obtiene todos los permisos de módulos con paginación y filtros
   */
  async findAll(filters?: IModuloPermisoFilters): Promise<PaginatedResponseDto<IModuloPermisoResponse>> {
    try {
      // Normalizar page y limit desde query (pueden llegar como string)
      const rawPage: any = filters?.page;
      const rawLimit: any = filters?.limit;
      const pageNum = Number.isFinite(Number(rawPage)) && Number(rawPage) > 0 ? Number(rawPage) : 1;
      const limitNum = Number.isFinite(Number(rawLimit)) && Number(rawLimit) > 0 ? Number(rawLimit) : undefined;

      // Obtener permisos con filtros (y usar su longitud para el total real)
      const permisos = await this.moduloPermisoRepository.findAll(filters);
      const total = permisos.length;

      // Paginación manual segura
      let paginatedPermisos = permisos;
      let totalPages = 1;
      if (limitNum !== undefined) {
        const skip = (pageNum - 1) * limitNum;
        paginatedPermisos = permisos.slice(skip, skip + limitNum);
        totalPages = Math.max(1, Math.ceil(total / limitNum));
      }

      const mappedPermisos = paginatedPermisos.map(permiso => this.mapToModuloPermisoResponse(permiso));

      return {
        data: mappedPermisos,
        total,
        page: pageNum,
        limit: limitNum ?? total,
        totalPages,
        hasNext: limitNum ? pageNum < totalPages : false,
        hasPrev: limitNum ? pageNum > 1 : false,
      };
    } catch (error) {
      this.logger.error('Error obteniendo permisos de módulos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un permiso de módulo por ID
   */
  async findOne(id: number): Promise<IModuloPermisoResponse> {
    try {
      const permiso = await this.moduloPermisoRepository.findById(id);

      if (!permiso) {
        throw new NotFoundException(`Permiso de módulo con ID ${id} no encontrado`);
      }

      return this.mapToModuloPermisoResponse(permiso);
    } catch (error) {
      this.logger.error(`Error obteniendo permiso de módulo ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene permisos por módulo
   */
  async findByModulo(idModulo: number): Promise<IModuloPermisoResponse[]> {
    try {
      const permisos = await this.moduloPermisoRepository.findAll({ idModulo });
      return permisos.map(permiso => this.mapToModuloPermisoResponse(permiso));
    } catch (error) {
      this.logger.error(`Error obteniendo permisos del módulo ${idModulo}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo permiso de módulo
   */
  async create(createData: IModuloPermisoCreateData, userId: number): Promise<IModuloPermisoResponse> {
    try {
      this.logger.log(`Creando permiso para módulo ${createData.idModulo} (usuario: ${userId})`);
      
      // Validar parámetros
      if (!createData.idModulo || !Number.isInteger(Number(createData.idModulo)) || Number(createData.idModulo) <= 0) {
        throw new BadRequestException(`ID de módulo inválido: ${createData.idModulo} (tipo: ${typeof createData.idModulo})`);
      }
      if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
        throw new BadRequestException(`ID de usuario inválido: ${userId} (tipo: ${typeof userId})`);
      }

      const idModulo = Number(createData.idModulo);
      const userIdNum = Number(userId);

      // Verificar si ya existe un permiso para este módulo
      const existingPermiso = await this.moduloPermisoRepository.findByModulo(idModulo);
      if (existingPermiso) {
        throw new BadRequestException(`Ya existe un permiso para el módulo con ID ${idModulo}`);
      }

      const permiso = await this.moduloPermisoRepository.create({
        IdModulo: idModulo,
        Ver: createData.ver ?? false,
        Agregar: createData.agregar ?? false,
        Editar: createData.editar ?? false,
        Eliminar: createData.eliminar ?? false,
        UserAdd: userIdNum
      });

      this.logger.log(`Permiso de módulo creado exitosamente: ${permiso.Id}`);
      return this.mapToModuloPermisoResponse(permiso);
    } catch (error) {
      this.logger.error('Error creando permiso de módulo:', error);
      throw error;
    }
  }



  /**
   * Actualiza un permiso de módulo
   */
  async update(id: number, updateData: IModuloPermisoUpdateData, userId: number): Promise<IModuloPermisoResponse> {
    try {
      const existingPermiso = await this.moduloPermisoRepository.findById(id);
      if (!existingPermiso) {
        throw new NotFoundException(`Permiso de módulo con ID ${id} no encontrado`);
      }

      // Preparar datos para actualización
      const updateFields: any = {};
      
      if (updateData.idModulo !== undefined) updateFields.IdModulo = updateData.idModulo;
      if (updateData.ver !== undefined) updateFields.Ver = updateData.ver;
      if (updateData.agregar !== undefined) updateFields.Agregar = updateData.agregar;
      if (updateData.editar !== undefined) updateFields.Editar = updateData.editar;
      if (updateData.eliminar !== undefined) updateFields.Eliminar = updateData.eliminar;
      if (updateData.rowActive !== undefined) updateFields.RowActive = updateData.rowActive;

      // Agregar usuario que modificó
      updateFields.UserMod = userId;

      const updatedPermiso = await this.moduloPermisoRepository.update(id, updateFields);

      if (!updatedPermiso) {
        throw new NotFoundException('Error al actualizar el permiso de módulo');
      }

      this.logger.log(`Permiso de módulo ${id} actualizado exitosamente`);
      return this.mapToModuloPermisoResponse(updatedPermiso);
    } catch (error) {
      this.logger.error(`Error actualizando permiso de módulo ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un permiso de módulo (soft delete)
   */
  async remove(id: number, userId: number): Promise<{ message: string; permiso: any }> {
    try {
      const existingPermiso = await this.moduloPermisoRepository.findById(id);
      if (!existingPermiso) {
        throw new NotFoundException(`Permiso de módulo con ID ${id} no encontrado`);
      }

      await this.moduloPermisoRepository.delete(id, userId);

      this.logger.log(`Permiso de módulo ${id} eliminado exitosamente por usuario ${userId}`);

      return {
        message: 'Permiso de módulo eliminado exitosamente',
        permiso: {
          id: existingPermiso.Id,
          idModulo: existingPermiso.IdModulo
        }
      };
    } catch (error) {
      this.logger.error(`Error eliminando permiso de módulo ${id}:`, error);
      throw error;
    }
  }

  /**
   * Restaura un permiso de módulo eliminado
   */
  async restore(id: number, userId: number): Promise<{ message: string; permiso: IModuloPermisoResponse }> {
    try {
      await this.moduloPermisoRepository.restore(id, userId);

      const restoredPermiso = await this.moduloPermisoRepository.findById(id);
      if (!restoredPermiso) {
        throw new NotFoundException('Error al restaurar el permiso de módulo');
      }

      this.logger.log(`Permiso de módulo ${id} restaurado exitosamente por usuario ${userId}`);

      return {
        message: 'Permiso de módulo restaurado exitosamente',
        permiso: this.mapToModuloPermisoResponse(restoredPermiso)
      };
    } catch (error) {
      this.logger.error(`Error restaurando permiso de módulo ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene permisos eliminados
   */
  async findDeleted(): Promise<IModuloPermisoResponse[]> {
    try {
      const deletedPermisos = await this.moduloPermisoRepository.findAll({ active: false });
      return deletedPermisos.map(permiso => this.mapToModuloPermisoResponse(permiso));
    } catch (error) {
      this.logger.error('Error obteniendo permisos de módulos eliminados:', error);
      throw error;
    }
  }

  /**
   * Obtiene permisos por rol (simula el script SQL)
   */
  async getPermisosByRol(idRol: number): Promise<any[]> {
    try {
      // Ejecutar consulta similar al script SQL
      const query = `
        SELECT 
          m.Modulo,
          rp.IdRol,
          mp.IdModulo,
          mp.Ver,
          mp.Agregar,
          mp.Editar,
          mp.Eliminar
        FROM RolesPermisos rp
        LEFT JOIN ModulosPermisos mp ON rp.IdPermiso = mp.Id
        LEFT JOIN Modulos m ON mp.IdModulo = m.Id
        WHERE rp.IdRol = @0 AND rp.RowActive = 1
        ORDER BY m.Id
      `;

      const result = await this.moduloPermisoRepository['dataSource'].query(query, [idRol]);
      
      return result.map(row => ({
        modulo: row.Modulo,
        idRol: row.IdRol,
        idModulo: row.IdModulo,
        ver: Boolean(row.Ver),
        agregar: Boolean(row.Agregar),
        editar: Boolean(row.Editar),
        eliminar: Boolean(row.Eliminar)
      }));
    } catch (error) {
      this.logger.error(`Error obteniendo permisos por rol ${idRol}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo permiso de módulo por rol y módulo
   */
  async createByRolAndModule(createData: { idRol: number, Module_name: string, ver: boolean, agregar: boolean, editar: boolean, eliminar: boolean }, userId: number): Promise<IModuloPermisoResponse> {
    try {
      this.logger.log(`Creando permiso por rol ${createData.idRol} y módulo "${createData.Module_name}" (usuario: ${userId})`);
      
      // Validar parámetros
      if (!createData.idRol || !Number.isInteger(Number(createData.idRol)) || Number(createData.idRol) <= 0) {
        throw new BadRequestException(`ID de rol inválido: ${createData.idRol} (tipo: ${typeof createData.idRol})`);
      }
      if (!createData.Module_name || typeof createData.Module_name !== 'string' || createData.Module_name.trim().length === 0) {
        throw new BadRequestException(`Nombre de módulo inválido: ${createData.Module_name}`);
      }
      if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
        throw new BadRequestException(`ID de usuario inválido: ${userId} (tipo: ${typeof userId})`);
      }

      const idRol = Number(createData.idRol);
      const userIdNum = Number(userId);

      // 1. Encontrar o crear el módulo
      const modulo = await this.moduloRepository.findOrCreate(createData.Module_name.trim(), userIdNum);
      
      // 2. Verificar si ya existe un permiso para este módulo
      let permiso = await this.moduloPermisoRepository.findByModulo(modulo.Id);
      
      if (!permiso) {
        // 3. Crear el permiso si no existe
        permiso = await this.moduloPermisoRepository.create({
          IdModulo: modulo.Id,
          Ver: createData.ver,
          Agregar: createData.agregar,
          Editar: createData.editar,
          Eliminar: createData.eliminar,
          UserAdd: userIdNum
        });
      } else {
        // 3b. Actualizar el permiso existente con los nuevos valores
        permiso = await this.moduloPermisoRepository.update(permiso.Id, {
          Ver: createData.ver,
          Agregar: createData.agregar,
          Editar: createData.editar,
          Eliminar: createData.eliminar,
          UserMod: userIdNum
        });
      }

      // 4. Verificar si ya existe la relación rol-permiso
      const existingRolPermiso = await this.rolesPermisosRepository.findByRolAndPermiso(idRol, permiso.Id);
      if (existingRolPermiso) {
        throw new BadRequestException(`Ya existe un permiso para el rol ${idRol} y módulo "${createData.Module_name}"`);
      }

      // 5. Crear la relación en RolesPermisos (usando el ID del permiso, no del módulo)
      await this.rolesPermisosRepository.create(idRol, permiso.Id, userIdNum);

      this.logger.log(`Permiso de módulo creado exitosamente: ${permiso.Id} para módulo "${createData.Module_name}" y rol ${idRol}`);
      return this.mapToModuloPermisoResponse(permiso);
    } catch (error) {
      this.logger.error('Error creando permiso de módulo por rol:', error);
      throw error;
    }
  }

  /**
   * Mapea la entidad a la respuesta
   */
  private mapToModuloPermisoResponse(permiso: any): IModuloPermisoResponse {
    return {
      id: permiso.Id,
      idModulo: permiso.IdModulo,
      modulo: permiso.modulo?.Modulo,
      ver: Boolean(permiso.Ver),
      agregar: Boolean(permiso.Agregar),
      editar: Boolean(permiso.Editar),
      eliminar: Boolean(permiso.Eliminar),
      rowActive: Boolean(permiso.RowActive),
      userAdd: permiso.UserAdd,
      userMod: permiso.UserMod,
      userDel: permiso.UserDel
    };
  }

  /**
   * Actualiza múltiples permisos por rol
   */
  async bulkUpdateByRol(permisos: any[]): Promise<IModuloPermisoResponse[]> {
    const resultados = [];
    
    for (const permiso of permisos) {
      try {
        const updated = await this.update(permiso.id || permiso.Id, permiso, 1); // userId por defecto
        resultados.push(updated);
      } catch (error) {
        this.logger.error(`Error actualizando permiso ${permiso.id || permiso.Id}:`, error);
        throw error;
      }
    }
    
    return resultados;
  }

  /**
   * Añade (o asegura) un permiso de módulo para un rol, a partir de idRol e idModulo
   * - Crea el registro en ModulosPermisos si no existe (con permisos básicos)
   * - Crea la relación en RolesPermisos si no existe
   */
  async addModuleToRole(
    idRol: number,
    idModulo: number,
    userId: number,
    options?: { ver?: boolean; agregar?: boolean; editar?: boolean; eliminar?: boolean },
  ): Promise<IModuloPermisoResponse> {
    try {
      this.logger.log(`Añadiendo módulo ${idModulo} al rol ${idRol} (usuario: ${userId})`);
      
      // Validar parámetros
      if (!Number.isInteger(idRol) || idRol <= 0) {
        throw new BadRequestException(`ID de rol inválido: ${idRol}`);
      }
      if (!Number.isInteger(idModulo) || idModulo <= 0) {
        throw new BadRequestException(`ID de módulo inválido: ${idModulo}`);
      }
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestException(`ID de usuario inválido: ${userId}`);
      }

      // 1) Encontrar o crear el permiso para el módulo
      let permiso = await this.moduloPermisoRepository.findByModulo(idModulo);

      if (!permiso) {
        this.logger.log(`Creando nuevo permiso para módulo ${idModulo}`);
        permiso = await this.moduloPermisoRepository.create({
          IdModulo: idModulo,
          Ver: options?.ver ?? true,
          Agregar: options?.agregar ?? false,
          Editar: options?.editar ?? false,
          Eliminar: options?.eliminar ?? false,
          UserAdd: userId,
        });
      }

      // 2) Actualizar flags si se proporcionaron opciones
      if (options && (
        options.ver !== undefined ||
        options.agregar !== undefined ||
        options.editar !== undefined ||
        options.eliminar !== undefined
      )) {
        this.logger.log(`Actualizando permisos para módulo ${idModulo}`);
        const updateFields: any = { UserMod: userId };
        if (options.ver !== undefined) updateFields.Ver = options.ver;
        if (options.agregar !== undefined) updateFields.Agregar = options.agregar;
        if (options.editar !== undefined) updateFields.Editar = options.editar;
        if (options.eliminar !== undefined) updateFields.Eliminar = options.eliminar;

        const updated = await this.moduloPermisoRepository.update(permiso.Id, updateFields);
        if (updated) {
          permiso = updated as any;
        }
      }

      // 3) Verificar si ya existe la relación rol-permiso
      const existing = await this.rolesPermisosRepository.findByRolAndPermiso(idRol, permiso.Id);
      
      if (existing) {
        this.logger.log(`Relación ya existe entre rol ${idRol} y permiso ${permiso.Id}, devolviendo permiso actualizado`);
        return this.mapToModuloPermisoResponse(permiso);
      }

      // 4) Crear la relación rol-permiso
      this.logger.log(`Creando relación entre rol ${idRol} y permiso ${permiso.Id}`);
      await this.rolesPermisosRepository.create(idRol, permiso.Id, userId);

      return this.mapToModuloPermisoResponse(permiso);
    } catch (error) {
      this.logger.error(
        `Error añadiendo módulo ${idModulo} al rol ${idRol}:`,
        error,
      );
      throw error;
    }
  }
}
