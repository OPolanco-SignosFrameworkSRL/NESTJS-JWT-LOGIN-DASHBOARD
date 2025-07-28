"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NestJS JWT Login Dashboard API')
        .setDescription('API para sistema de autenticación con JWT y dashboard')
        .setVersion('1.0')
        .addTag('auth', 'Endpoints de autenticación')
        .addTag('users', 'Endpoints de usuarios')
        .addTag('vappusuarios', 'Endpoints de vista de usuarios')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app.useStaticAssets((0, path_1.join)(__dirname, 'frontend'), {
        prefix: '/frontend/'
    });
    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
    console.log('Frontend available at: http://localhost:3000/frontend/');
    console.log('Swagger API documentation available at: http://localhost:3000/api');
}
bootstrap();
