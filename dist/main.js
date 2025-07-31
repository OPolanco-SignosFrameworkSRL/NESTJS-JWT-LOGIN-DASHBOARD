"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const path_1 = require("path");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const corsConfig = configService.get('app.cors');
    app.enableCors(corsConfig);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'src', 'frontend'));
    const swaggerConfig = configService.get('app.swagger');
    const config = new swagger_1.DocumentBuilder()
        .setTitle(swaggerConfig.title)
        .setDescription(swaggerConfig.description)
        .setVersion(swaggerConfig.version)
        .addBearerAuth()
        .addTag('Autenticación', 'Endpoints para autenticación y autorización')
        .addTag('Usuarios', 'Gestión de usuarios del sistema')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(swaggerConfig.path, app, document);
    const port = configService.get('app.port', 3000);
    const environment = configService.get('app.environment', 'development');
    await app.listen(port);
    logger.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
    logger.log(`📚 Documentación disponible en: http://localhost:${port}/${swaggerConfig.path}`);
    logger.log(`🌐 Frontend disponible en: http://localhost:${port}`);
    logger.log(`🔧 Entorno: ${environment}`);
}
bootstrap().catch(error => {
    console.error('❌ Error iniciando la aplicación:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map