import { Injectable } from '@nestjs/common';
import { RolesService } from '../../domain/services/roles.service';
import { Role } from '../../domain/entities/role.entity';
import { IUpdateRoleData } from '../../domain/interfaces/role.interface';

/**
 * Caso de uso: Actualizar Role
 * Orquesta la actualización de un rol existente
 */
@Injectable()
export class UpdateRoleUseCase {
  constructor(private readonly rolesService: RolesService) {}

  async execute(id: number, roleData: IUpdateRoleData): Promise<Role | null> {
    return this.rolesService.updateRole(id, roleData);
  }
}
