import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET', 'tu_clave_secreta_aqui'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
    issuer: configService.get<string>('JWT_ISSUER', 'solicitud-efectivo-api'),
    audience: configService.get<string>(
      'JWT_AUDIENCE',
      'solicitud-efectivo-users',
    ),
  },
  verifyOptions: {
    issuer: configService.get<string>('JWT_ISSUER', 'solicitud-efectivo-api'),
    audience: configService.get<string>(
      'JWT_AUDIENCE',
      'solicitud-efectivo-users',
    ),
  },
});
