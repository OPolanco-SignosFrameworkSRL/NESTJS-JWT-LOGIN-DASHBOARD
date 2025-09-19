import { Injectable, Inject } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { IRoleRepository } from '../repositories/role.repository.interface';
import { 
  IRoleFilters, 
  ICreateRoleData, 
  IUpdateRoleData, 
  IRolePaginatedResponse, 
  IRoleStats 
} from '../interfaces/role.interface';

/**
 * Servicio de dominio para la gestión de roles
 * Contiene la lógica de negocio para las operaciones de roles
 */
@Injectable()
export class RolesService {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  /**
   * Obtiene todos los roles con filtros opcionales
   */
  async getAllRoles(filters?: IRoleFilters): Promise<Role[]> {
    return this.roleRepository.findAll(filters);
  }

  /**
   * Obtiene roles con paginación
   */
  async getRolesPaginated(
    filters?: IRoleFilters, 
    page?: number, 
    limit?: number
  ): Promise<IRolePaginatedResponse> {
    return this.roleRepository.findAllPaginated(filters, page, limit);
  }

  /**
   * Obtiene un rol por ID
   */
  async getRoleById(id: number): Promise<Role | null> {
    if (id <= 0) {
      throw new Error('El ID del rol debe ser un número positivo');
    }
    return this.roleRepository.findById(id);
  }

  /**
   * Obtiene un rol por nombre
   */
  async getRoleByName(roleName: string): Promise<Role | null> {
    if (!roleName?.trim()) {
      throw new Error('El nombre del rol es requerido');
    }
    return this.roleRepository.findByName(roleName.trim());
  }

  /**
   * Crea un nuevo rol
   */
  async createRole(roleData: ICreateRoleData): Promise<Role> {
    // Validaciones de negocio
    await this.validateRoleData(roleData);
    
    // Verificar que no exista un rol con el mismo nombre
    const existingRole = await this.roleRepository.findByName(roleData.role_name);
    if (existingRole) {
      throw new Error(`Ya existe un rol con el nombre: ${roleData.role_name}`);
    }

    return this.roleRepository.create(roleData);
  }

  /**
   * Actualiza un rol existente
   */
  async updateRole(id: number, roleData: IUpdateRoleData): Promise<Role | null> {
    if (id <= 0) {
      throw new Error('El ID del rol debe ser un número positivo');
    }

    // Verificar que el rol existe
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new Error(`No se encontró el rol con ID: ${id}`);
    }

    // Si se está actualizando el nombre, verificar que no exista otro rol con ese nombre
    if (roleData.role_name) {
      const roleWithSameName = await this.roleRepository.findByName(roleData.role_name);
      if (roleWithSameName && roleWithSameName.id !== id) {
        throw new Error(`Ya existe un rol con el nombre: ${roleData.role_name}`);
      }
    }

    // Validaciones de negocio para actualización
    if (roleData.role_name || roleData.role_desc) {
      await this.validateRoleData(roleData as ICreateRoleData, true);
    }

    return this.roleRepository.update(id, roleData);
  }

  /**
   * Desactiva un rol (soft delete)
   */
  async deactivateRole(id: number, userDelId?: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('El ID del rol debe ser un número positivo');
    }

    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error(`No se encontró el rol con ID: ${id}`);
    }

    if (!role.isActive()) {
      throw new Error(`El rol "${role.role_name}" ya está desactivado. No se requiere acción adicional.`);
    }

    // Verificar si el rol es crítico para el sistema
    if (this.isCriticalRole(role)) {
      throw new Error('No se puede desactivar un rol crítico del sistema');
    }

    return this.roleRepository.delete(id, userDelId);
  }

  /**
   * Reactiva un rol
   */
  async activateRole(id: number): Promise<boolean> {
    if (id <= 0) {70
      throw new Error('El ID del rol debe ser un número positivo');
    }

    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error(`No se encontró el rol con ID: ${id}`);
    }

    if (role.isActive()) {
      throw new Error('El rol ya está activo');
    }

    return this.roleRepository.restore(id);
  }

  /**
   * Elimina permanentemente un rol
   */
  async deleteRolePermanently(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('El ID del rol debe ser un número positivo');
    }

    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error(`No se encontró el rol con ID: ${id}`);
    }

    // Verificar si el rol es crítico para el sistema
    if (this.isCriticalRole(role)) {
      throw new Error('No se puede eliminar un rol crítico del sistema');
    }

    return this.roleRepository.hardDelete(id);
  }

  /**
   * Obtiene estadísticas de roles
   */
/*   async getRoleStats(): Promise<IRoleStats> {
    return this.roleRepository.getStats();
  }
 */
  /**
   * Obtiene solo los roles activos
   */
  async getActiveRoles(): Promise<Role[]> {
    return this.roleRepository.findActiveRoles();
  }

  /**
   * Obtiene solo los roles inactivos
   */
  async getInactiveRoles(): Promise<Role[]> {
    return this.roleRepository.findInactiveRoles();
  }

  /**
   * Busca roles por texto
   */
  async searchRoles(searchText: string): Promise<Role[]> {
    if (!searchText?.trim()) {
      throw new Error('El texto de búsqueda es requerido');
    }
    return this.roleRepository.searchByText(searchText.trim());
  }

  /**
   * Cuenta roles con filtros
   */
  async countRoles(filters?: IRoleFilters): Promise<number> {
    return this.roleRepository.count(filters);
  }

  /**
   * Valida los datos de un rol
   */
  private async validateRoleData(roleData: ICreateRoleData, isUpdate: boolean = false): Promise<void> {
    if (!isUpdate && !roleData.role_name?.trim()) {
      throw new Error('El nombre del rol es requerido');
    }

    // role_desc es opcional, solo validar si se proporciona
    // if (!isUpdate && !roleData.role_desc?.trim()) {
    //   throw new Error('La descripción del rol es requerida');
    // }

    if (roleData.role_name) {
      if (roleData.role_name.trim().length < 2) {
        throw new Error('El nombre del rol debe tener al menos 2 caracteres');
      }

      if (roleData.role_name.trim().length > 50) {
        throw new Error('El nombre del rol no puede exceder 50 caracteres');
      }
    }

    if (roleData.role_desc && roleData.role_desc.trim()) {
      if (roleData.role_desc.trim().length < 5) {
        throw new Error('La descripción del rol debe tener al menos 5 caracteres');
      }

      if (roleData.role_desc.trim().length > 255) {
        throw new Error('La descripción del rol no puede exceder 255 caracteres');
      }
    }
  }

  /**
   * Verifica si un rol es crítico para el sistema
   */
  private isCriticalRole(role: Role): boolean {
    const criticalRoles = ['Administrador', 'Administrator', 'Admin'];
    return criticalRoles.includes(role.role_name);
  }
}
