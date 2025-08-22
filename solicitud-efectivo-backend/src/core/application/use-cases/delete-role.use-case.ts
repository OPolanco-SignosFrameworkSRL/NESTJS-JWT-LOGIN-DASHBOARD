import { Injectable } from '@nestjs/common';
import { RolesService } from '../../domain/services/roles.service';

/**
 * Caso de uso: Eliminar Role
 * Orquesta la eliminación (desactivación) de un rol
 */
@Injectable()
export class DeleteRoleUseCase {
  constructor(private readonly rolesService: RolesService) {}

  async execute(id: number): Promise<boolean> {
    return this.rolesService.deactivateRole(id);
  }

  async executeHardDelete(id: number): Promise<boolean> {
    return this.rolesService.deleteRolePermanently(id);
  }

  async executeRestore(id: number): Promise<boolean> {
    return this.rolesService.activateRole(id);
  }
}
