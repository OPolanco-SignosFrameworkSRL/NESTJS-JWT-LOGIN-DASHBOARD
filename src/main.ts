import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global de respuestas
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Configuración de CORS
  const corsConfig = configService.get('app.cors');
  app.enableCors(corsConfig);

  // Servir archivos estáticos del frontend
  app.useStaticAssets(join(__dirname, '..', 'src', 'frontend'));

  // Configuración de Swagger
  const swaggerConfig = configService.get('app.swagger');
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .addTag('Autenticación', 'Endpoints para autenticación y autorización')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConfig.path, app, document);

  const port = configService.get('app.port', 3000);
  const environment = configService.get('app.environment', 'development');

  await app.listen(port);

  logger.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  logger.log(
    `📚 Documentación disponible en: http://localhost:${port}/${swaggerConfig.path}`,
  );
  logger.log(`🌐 Frontend disponible en: http://localhost:${port}`);
  logger.log(`🔧 Entorno: ${environment}`);
}

bootstrap().catch(error => {
  console.error('❌ Error iniciando la aplicación:', error);
  process.exit(1);
});
