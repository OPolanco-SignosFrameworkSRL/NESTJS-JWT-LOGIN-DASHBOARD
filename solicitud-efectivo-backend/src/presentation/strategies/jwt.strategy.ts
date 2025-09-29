import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ModulosPermisosService } from '../../core/domain/services/modulos-permisos.service';
import { IUserPayload } from '../../core/domain/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly modulosPermisosService: ModulosPermisosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'mi_clave_secreta_super_segura_para_jwt',
    });
  }

  async validate(payload: any): Promise<IUserPayload> {
    // Si el token no trae rolesPermisos, reconstruirlos combinando todos los roles del usuario
    let rolesPermisos = payload.rolesPermisos || [];
    if ((!rolesPermisos || rolesPermisos.length === 0) && Array.isArray(payload.rolesUsuario) && payload.rolesUsuario.length > 0) {
      try {
        const acumulado: Record<string, { modulo: string; ver?: boolean; agregar?: boolean; editar?: boolean; eliminar?: boolean }> = {};
        for (const r of payload.rolesUsuario) {
          const permisos = await this.modulosPermisosService.getPermisosByRol(r.id);
          for (const p of permisos) {
            const key = String(p.modulo);
            if (!acumulado[key]) {
              acumulado[key] = {
                modulo: key,
                ver: Boolean(p.ver),
                agregar: Boolean(p.agregar),
                editar: Boolean(p.editar),
                eliminar: Boolean(p.eliminar),
              };
            } else {
              acumulado[key].ver = Boolean(acumulado[key].ver || p.ver);
              acumulado[key].agregar = Boolean(acumulado[key].agregar || p.agregar);
              acumulado[key].editar = Boolean(acumulado[key].editar || p.editar);
              acumulado[key].eliminar = Boolean(acumulado[key].eliminar || p.eliminar);
            }
          }
        }
        rolesPermisos = Object.values(acumulado).filter((p: any) => p.ver || p.agregar || p.editar || p.eliminar);
      } catch {}
    }
    return {
      id: payload.sub,
      cedula: payload.cedula,
      sub: payload.sub,
      fullname: payload.fullname,
      rolesUsuario: payload.rolesUsuario || [],
      rolesPermisos,
      email: payload.email,
      valido: payload.valido,
    };
  }
} 