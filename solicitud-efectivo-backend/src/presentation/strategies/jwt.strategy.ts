import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUserPayload } from '../../core/domain/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'mi_clave_secreta_super_segura_para_jwt',
    });
  }

  async validate(payload: any): Promise<IUserPayload> {
    return {
      id: payload.sub,
      cedula: payload.cedula,
      sub: payload.sub,
      fullname: payload.fullname,
      rolesUsuario: payload.rolesUsuario || [],
      email: payload.email,
      valido: payload.valido,
    };
  }
} 