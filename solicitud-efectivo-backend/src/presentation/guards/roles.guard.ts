import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoleIds = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoleIds) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoleIds.some((roleId) => 
      user.rolesUsuario?.some((rol: any) => rol.id === roleId)
    );
  }
} 