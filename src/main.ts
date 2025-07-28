import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const __dirname: string;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS JWT Login Dashboard API')
    .setDescription('API para sistema de autenticación con JWT y dashboard')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('users', 'Endpoints de usuarios')
    .addTag('vappusuarios', 'Endpoints de vista de usuarios')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Serve frontend static files only for specific routes
  app.useStaticAssets(join(__dirname, 'frontend'), {
    prefix: '/frontend/'
  });

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Frontend available at: http://localhost:3000/frontend/');
  console.log('Swagger API documentation available at: http://localhost:3000/api');
}
bootstrap();
