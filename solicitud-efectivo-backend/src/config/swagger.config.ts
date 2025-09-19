import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('API de Solicitud de Efectivo - Grupo Astro')
    .setDescription(
      `
      API REST para gestión de solicitudes de efectivo y usuarios.
      
      ## Características principales:
      - 🔐 Autenticación JWT
      - 👥 Gestión de usuarios
      - 📊 Consultas a vistas SQL Server
      - 🛡️ Validación de datos
      - 📚 Documentación automática
      
      ## Autenticación:
      Para endpoints protegidos, incluye el token JWT en el header:
      \`\`\`
      Authorization: Bearer <token>
      \`\`\`
    `,
    )
    .setVersion('1.0.0')
    .addTag(
      'Autenticación',
      'Endpoints para login, registro y gestión de sesiones',
    )
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .addTag('Aplicación', 'Información general de la aplicación')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Servidor de desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'API Grupo Astro - Documentación',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .info .description { color: #7f8c8d; }
    `,
  });
};
