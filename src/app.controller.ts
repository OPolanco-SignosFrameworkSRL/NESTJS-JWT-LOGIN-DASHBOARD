import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ 
    summary: 'Endpoint raíz',
    description: 'Endpoint principal de la aplicación'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Respuesta exitosa',
    schema: {
      type: 'string',
      example: 'Hello World!'
    }
  })
  getHello(): string {
    return 'Hello World!';
  }

  @Get('test')
  @ApiOperation({ 
    summary: 'Probar aplicación',
    description: 'Endpoint de prueba para verificar que la aplicación funciona'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Aplicación funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'App controller is working!' }
      }
    }
  })
  test() {
    return { message: 'App controller is working!' };
  }

  @Post('login-test')
  @ApiOperation({ 
    summary: 'Probar login',
    description: 'Endpoint de prueba para simular un login'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login de prueba exitoso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login test endpoint' },
        received: { type: 'object', example: { email: 'test@test.com', password: '123456' } },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  loginTest(@Body() body: any) {
    return { 
      message: 'Login test endpoint',
      received: body,
      timestamp: new Date().toISOString()
    };
  }
} 