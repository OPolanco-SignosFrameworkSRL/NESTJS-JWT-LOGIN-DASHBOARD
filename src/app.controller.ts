import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Aplicación')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Información de la aplicación',
    description: 'Retorna información básica sobre la API',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de la aplicación',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'API de Solicitud de Efectivo' },
            version: { type: 'string', example: '1.0.0' },
            description: {
              type: 'string',
              example: 'API para gestión de solicitudes de efectivo',
            },
            status: { type: 'string', example: 'running' },
            timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Operación exitosa' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  getInfo() {
    return {
      name: 'API de Solicitud de Efectivo',
      version: '1.0.0',
      description: 'API para gestión de solicitudes de efectivo',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Estado de salud de la aplicación',
    description: 'Verifica que la aplicación esté funcionando correctamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicación funcionando correctamente',
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
