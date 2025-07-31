import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';
import { ResponseInterceptor } from './presentation/interceptors/response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

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

  const port = configService.get('app.port', 3001);
  const environment = configService.get('app.environment', 'development');

  await app.listen(port);

  logger.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  logger.log(
    `📚 Documentación disponible en: http://localhost:${port}/${swaggerConfig.path}`,
  );
  logger.log(`🔧 Entorno: ${environment}`);
}

bootstrap().catch(error => {
  console.error('❌ Error iniciando la aplicación:', error);
  process.exit(1);
});
