"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtConfig = void 0;
const getJwtConfig = (configService) => ({
    secret: configService.get('JWT_SECRET', 'tu_clave_secreta_aqui'),
    signOptions: {
        expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
        issuer: configService.get('JWT_ISSUER', 'solicitud-efectivo-api'),
        audience: configService.get('JWT_AUDIENCE', 'solicitud-efectivo-users'),
    },
    verifyOptions: {
        issuer: configService.get('JWT_ISSUER', 'solicitud-efectivo-api'),
        audience: configService.get('JWT_AUDIENCE', 'solicitud-efectivo-users'),
    },
});
exports.getJwtConfig = getJwtConfig;
//# sourceMappingURL=jwt.config.js.map