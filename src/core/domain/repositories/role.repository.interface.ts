import { Role } from '../entities/role.entity';
import { IRoleFilters, ICreateRoleData, IUpdateRoleData, IRolePaginatedResponse, IRoleStats } from '../interfaces/role.interface';

/**
 * Interface del repositorio de roles
 * Define el contrato para acceso a datos de roles
 */
export interface IRoleRepository {
  /**
   * Obtiene todos los roles con filtros opcionales
   */
  findAll(filters?: IRoleFilters): Promise<Role[]>;

  /**
   * Obtiene roles con paginación
   */
  findAllPaginated(filters?: IRoleFilters, page?: number, limit?: number): Promise<IRolePaginatedResponse>;

  /**
   * Busca un rol por ID
   */
  findById(id: number): Promise<Role | null>;

  /**
   * Busca un rol por nombre
   */
  findByName(roleName: string): Promise<Role | null>;

  /**
   * Crea un nuevo rol
   */
  create(roleData: ICreateRoleData): Promise<Role>;

  /**
   * Actualiza un rol existente
   */
  update(id: number, roleData: IUpdateRoleData): Promise<Role | null>;

  /**
   * Elimina un rol (soft delete)
   */
  delete(id: number): Promise<boolean>;

  /**
   * Restaura un rol eliminado
   */
  restore(id: number): Promise<boolean>;

  /**
   * Elimina permanentemente un rol
   */
  hardDelete(id: number): Promise<boolean>;

  /**
   * Verifica si existe un rol con el nombre dado
   */
  existsByName(roleName: string, excludeId?: number): Promise<boolean>;

  /**
   * Obtiene estadísticas de roles
   */
  getStats(): Promise<IRoleStats>;

  /**
   * Obtiene solo los roles activos
   */
  findActiveRoles(): Promise<Role[]>;

  /**
   * Obtiene solo los roles inactivos
   */
  findInactiveRoles(): Promise<Role[]>;

  /**
   * Busca roles por patrón de texto en nombre o descripción
   */
  searchByText(searchText: string): Promise<Role[]>;

  /**
   * Cuenta el total de roles
   */
  count(filters?: IRoleFilters): Promise<number>;
}
