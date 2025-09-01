import { Injectable } from '@nestjs/common';
import { RolesService } from '../../domain/services/roles.service';
import { Role } from '../../domain/entities/role.entity';
import { ICreateRoleData } from '../../domain/interfaces/role.interface';

/**
 * Caso de uso: Crear Role
 * Orquesta la creación de un nuevo rol en el sistema
 */
@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly rolesService: RolesService) {}

  async execute(roleData: ICreateRoleData): Promise<Role> {
    return this.rolesService.createRole(roleData);
  }
}
