import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { ModuloPermisoRepository } from '../../../infrastructure/repositories/modulo-permiso.repository';
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
  ) {}

  /**
   * Obtiene todos los permisos de módulos con paginación y filtros
   */
  async findAll(filters?: IModuloPermisoFilters): Promise<PaginatedResponseDto<IModuloPermisoResponse>> {
    try {
      const { page = 1, limit = 10 } = filters || {};
      const skip = (page - 1) * limit;

      // Obtener total de registros
      const total = await this.moduloPermisoRepository.count();

      // Obtener permisos con filtros
      const permisos = await this.moduloPermisoRepository.findAll(filters);

      // Aplicar paginación manual
      const paginatedPermisos = permisos.slice(skip, skip + limit);

      const totalPages = Math.ceil(total / limit);

      const mappedPermisos = paginatedPermisos.map(permiso => this.mapToModuloPermisoResponse(permiso));

      return {
        data: mappedPermisos,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
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
      // Verificar si ya existe un permiso para este módulo
      const existingPermiso = await this.moduloPermisoRepository.findByModulo(createData.idModulo);
      if (existingPermiso) {
        throw new BadRequestException(`Ya existe un permiso para el módulo con ID ${createData.idModulo}`);
      }

      const permiso = await this.moduloPermisoRepository.create({
        IdModulo: createData.idModulo,
        Ver: createData.ver,
        Agregar: createData.agregar,
        Editar: createData.editar,
        Eliminar: createData.eliminar,
        UserAdd: userId
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

      // Preparar datos para actualización (actualizar TODA la fila)
      const finalIdModulo = updateData.idModulo ?? existingPermiso.IdModulo;
      const finalVer = updateData.ver ?? Boolean(existingPermiso.Ver);
      const finalAgregar = updateData.agregar ?? Boolean(existingPermiso.Agregar);
      const finalEditar = updateData.editar ?? Boolean(existingPermiso.Editar);
      const finalEliminar = updateData.eliminar ?? Boolean(existingPermiso.Eliminar);
      const finalRowActive = updateData.rowActive ?? Boolean(existingPermiso.RowActive);

      const updateFields: any = {
        IdModulo: finalIdModulo,
        Ver: finalVer,
        Agregar: finalAgregar,
        Editar: finalEditar,
        Eliminar: finalEliminar,
        RowActive: finalRowActive,
        UserMod: userId,
      };

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
        LEFT JOIN ModulosPermisos mp ON rp.IdPermiso = mp.IdModulo
        LEFT JOIN Modulos m ON mp.IdModulo = m.Id
        WHERE rp.IdRol = @0 AND rp.RowActive = 1
        ORDER BY m.Id
      `;

      const result = await this.moduloPermisoRepository['dataSource'].query(query, [idRol]);
      
      // Filtrar los resultados que tienen idModulo null
      return result
        .filter(row => row.IdModulo !== null)
        .map(row => ({
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
   * Actualiza múltiples permisos por rol
   */
  async bulkUpdateByRol(permisosData: any[], userId: number): Promise<any[]> {
    try {
      const processedPermisos = [];

      for (const permisoData of permisosData) {
        try {
          // Buscar si ya existe un permiso para este módulo y rol
          const existingPermiso = await this.findByModuloAndRol(
            permisoData.idModulo,
            permisoData.idRol
          );

          if (existingPermiso) {
            // Si existe, actualizar
            const updated = await this.update(
              existingPermiso.id,
              {
                idModulo: permisoData.idModulo,
                ver: permisoData.ver,
                agregar: permisoData.agregar,
                editar: permisoData.editar,
                eliminar: permisoData.eliminar,
              },
              userId,
            );
            processedPermisos.push(updated);
          } else {
            // Si no existe, crear nuevo
            const created = await this.create(
              {
                idModulo: permisoData.idModulo,
                ver: permisoData.ver,
                agregar: permisoData.agregar,
                editar: permisoData.editar,
                eliminar: permisoData.eliminar,
              },
              userId,
            );
            processedPermisos.push(created);
          }
        } catch (error) {
          this.logger.error(
            `Error procesando permiso para módulo ${permisoData.idModulo} y rol ${permisoData.idRol}:`,
            error,
          );
          // Continuar con los siguientes permisos
        }
      }

      return processedPermisos;
    } catch (error) {
      this.logger.error('Error en bulk update por rol:', error);
      throw error;
    }
  }

  /**
   * Busca un permiso por módulo y rol
   */
  async findByModuloAndRol(idModulo: number, idRol: number): Promise<any | null> {
    try {
      // Buscar en el repositorio por módulo y rol (si el repositorio soporta IdRol)
      const permiso = await (this.moduloPermisoRepository as any).findByModuloAndRol(idModulo, idRol);
      if (!permiso) return null;
      return this.mapToModuloPermisoResponse(permiso);
    } catch (error) {
      this.logger.error(`Error buscando permiso por módulo ${idModulo} y rol ${idRol}:`, error);
      return null;
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
}
