import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UnauthorizedException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /*
  * POST /auth/login
  * Inicia sesión del usuario
  */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Valida credenciales de cédula y contraseña, genera token JWT'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cedula: { type: 'string', example: '00104168786' },
        password: { type: 'string', example: '******' }
      },
      required: ['cedula', 'password']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            cedula: { type: 'string', example: '00104168786' },
            fullname: { type: 'string', example: 'KENNY RODRIGUEZ' },
            role: { type: 'string', example: 'Usuario' },
            user_email: { type: 'string', example: '00104168786@grupoastro.com.do' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciales inválidas' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async login(@Body() body: { cedula: string; password: string }) {
    console.log('🚀 Login request received:', body);

    const user = await this.authService.validateUser(body.cedula, body.password);
    console.log('👤 User validation result:', user ? 'SUCCESS' : 'FAILED');

    if (!user) {
      console.log('❌ Login failed - invalid credentials');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('✅ Login successful, generating token');
    return this.authService.login(user);
  }

  /**
   * GET /auth/profile
   * Obtiene el perfil del usuario autenticado (protegido con JWT)
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Obtiene el perfil del usuario autenticado (requiere JWT)'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Perfil obtenido exitosamente' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            cedula: { type: 'string', example: '00104168786' },
            fullname: { type: 'string', example: 'KENNY RODRIGUEZ' },
            role: { type: 'string', example: 'Usuario' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async getProfile(@Request() req) {
    return {
      message: 'Perfil obtenido exitosamente',
      user: req.user
    };
  }

  /**
   * GET /auth/check-user/:cedula
   * Obtiene información del usuario para debugging (solo para administradores)
   */
  @Get('check-user/:cedula')
  @ApiOperation({
    summary: 'Verificar información de usuario',
    description: 'Obtiene información básica del usuario (solo para debugging administrativo)'
  })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario',
    schema: {
      type: 'object',
      properties: {
        found: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            cedula: { type: 'string', example: '00104168786' },
            nombre: { type: 'string', example: 'KENNY' },
            apellido: { type: 'string', example: 'RODRIGUEZ' },
            codigo: { type: 'string', example: '[ENCRYPTED]' },
            valido: { type: 'number', example: 1 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      type: 'object',
      properties: {
        found: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Usuario no encontrado' }
      }
    }
  })
  async checkUser(@Request() req) {
    const cedula = req.params.cedula;
    const result = await this.authService.checkUserInfo(cedula);
    
    // Si hay error, devolver el error
    if (result.error) {
      return { found: false, message: result.error };
    }
    
    // Devolver en el formato esperado
    return {
      found: true,
      user: {
        cedula: result.cedula,
        nombre: result.nombre,
        apellido: result.apellido,
        codigo: result.codigo,
        valido: result.valido,
        debug: result.debug // Incluir información de debugging
      }
    };
  }

  /**
   * GET /auth/test
   * Endpoint de prueba para verificar que el controlador funciona
   */
  @Get('test')
  @ApiOperation({
    summary: 'Probar controlador',
    description: 'Endpoint de prueba para verificar que el controlador funciona'
  })
  @ApiResponse({
    status: 200,
    description: 'Controlador funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Auth controller is working!' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        endpoints: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'POST /auth/login',
            'GET /auth/profile (protected)',
            'GET /auth/check-user/:cedula'
          ]
        }
      }
    }
  })
  test() {
    return {
      message: 'Auth controller is working!',
      timestamp: new Date().toISOString(),
      endpoints: [
        'POST /auth/login',
        'GET /auth/profile (protected)',
        'GET /auth/check-user/:cedula'
      ]
    };
  }

  /**
   * GET /auth/test-hash
   * Endpoint de prueba para verificar el hash SHA-256
   */
  @Get('test-hash')
  @ApiOperation({
    summary: 'Probar hash SHA-256',
    description: 'Prueba el algoritmo de hash SHA-256 para debugging'
  })
  @ApiResponse({
    status: 200,
    description: 'Información del hash',
    schema: {
      type: 'object',
      properties: {
        cedula: { type: 'string', example: '00104168786' },
        claveFija: { type: 'string', example: 'Hola123' },
        hashInput: { type: 'string', example: '00104168786Hola123' },
        hashResult: { type: 'string', example: 'e1bb0c390d430c61482ba2119e3770e015cced4d7be512185312d042d81cebd4' }
      }
    }
  })
  testHash() {
    const cedula = '00104168786';
    const claveFija = 'Hola123';
    const hashInput = cedula + claveFija;
    const hashResult = require('crypto').createHash('sha256').update(hashInput, 'utf8').digest('hex');
    
    return {
      cedula,
      claveFija,
      hashInput,
      hashResult,
      expectedHash: 'e1bb0c390d430c61482ba2119e3770e015cced4d7be512185312d042d81cebd4',
      matches: hashResult === 'e1bb0c390d430c61482ba2119e3770e015cced4d7be512185312d042d81cebd4'
    };
  }
} 