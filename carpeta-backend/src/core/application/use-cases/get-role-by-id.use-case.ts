import { Injectable } from '@nestjs/common';
import { RolesService } from '../../domain/services/roles.service';
import { Role } from '../../domain/entities/role.entity';

/**
 * Caso de uso: Obtener Role por ID
 * Orquesta la obtención de un rol específico por su ID
 */
@Injectable()
export class GetRoleByIdUseCase {
  constructor(private readonly rolesService: RolesService) {}

  async execute(id: number): Promise<Role | null> {
    return this.rolesService.getRoleById(id);
  }
}
