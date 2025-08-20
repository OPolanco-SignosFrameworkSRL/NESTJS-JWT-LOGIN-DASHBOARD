import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME || 'Solicitud Efectivo API',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'API de Solicitud de Efectivo',
    description:
      process.env.SWAGGER_DESCRIPTION ||
      'API para gestión de solicitudes de efectivo',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api',
  },
}));
