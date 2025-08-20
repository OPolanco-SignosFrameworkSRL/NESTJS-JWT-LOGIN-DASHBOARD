import { Injectable } from '@nestjs/common';
import { RolesService } from '../../domain/services/roles.service';
import { Role } from '../../domain/entities/role.entity';
import { IRoleFilters, IRolePaginatedResponse } from '../../domain/interfaces/role.interface';

/**
 * Caso de uso: Obtener Roles
 * Orquesta la obtención de roles del sistema
 */
@Injectable()
export class GetRolesUseCase {
  constructor(private readonly rolesService: RolesService) {}

  async execute(filters?: IRoleFilters): Promise<Role[]> {
    return this.rolesService.getAllRoles(filters);
  }

  async executePaginated(
    filters?: IRoleFilters, 
    page?: number, 
    limit?: number
  ): Promise<IRolePaginatedResponse> {
    return this.rolesService.getRolesPaginated(filters, page, limit);
  }

  async executeActiveRoles(): Promise<Role[]> {
    return this.rolesService.getActiveRoles();
  }
}
