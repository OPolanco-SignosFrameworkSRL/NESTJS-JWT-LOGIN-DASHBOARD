/* import { Injectable } from '@nestjs/common';
import { RolesService } from '../../domain/services/roles.service';
import { IRoleStats } from '../../domain/interfaces/role.interface';

 * Caso de uso: Obtener Estadísticas de Roles
 * Orquesta la obtención de estadísticas del sistema de roles
 
@Injectable()
export class GetRoleStatsUseCase {
  constructor(private readonly rolesService: RolesService) {}

  async execute(): Promise<IRoleStats> {
    return this.rolesService.getRoleStats();
  }
}
 */