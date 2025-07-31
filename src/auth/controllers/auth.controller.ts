import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../application/dto/login.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { UpdatePhoneDto } from '../../application/dto/update-phone.dto';
import { JwtAuthGuard } from '../../presentation/guards/jwt-auth.guard';
import { ILoginResponse } from '../../domain/interfaces/user.interface';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            cedula: { type: 'string', example: '40245980129' },
            fullname: { type: 'string', example: 'Raul Vargas' },
            role: { type: 'string', example: 'Usuario' },
            user_email: {
              type: 'string',
              example: 'raul.vargas@grupoastro.com.do',
            },
          },
        },
        expires_in: { type: 'number', example: 86400 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    const user = await this.authService.validateUser(
      loginDto.cedula,
      loginDto.password,
    );

    

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas BUG');
    }

    return await this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario creado correctamente' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El usuario ya existe',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.createUser(registerDto);
  }

  @Post('check-user')
  @ApiOperation({ summary: 'Verificar información de usuario (debug)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Información del usuario obtenida',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  async checkUserInfo(@Body('cedula') cedula: string) {
    return await this.authService.checkUserInfo(cedula);
  }

  @Post('verify-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar token JWT' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token válido',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido',
  })
  async verifyToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
      message: 'Token válido',
    };
  }

  @Post('update-phone')
  @ApiOperation({ summary: 'Actualizar teléfono del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teléfono actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Teléfono actualizado exitosamente' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            cedula: { type: 'string', example: '40245980129' },
            nombre: { type: 'string', example: 'Raul' },
            apellido: { type: 'string', example: 'Vargas' },
            telefono: { type: 'string', example: '8091234567' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async updatePhone(@Body() updatePhoneDto: UpdatePhoneDto) {
    return await this.authService.updateUserPhone(
      updatePhoneDto.cedula,
      updatePhoneDto.clave,
      updatePhoneDto.telefono,
    );
  }

  @Get('check-schema')
  @ApiOperation({ summary: 'Verificar esquema de la base de datos (temporal)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Esquema de la base de datos' })
  async checkSchema() {
    return await this.authService.checkDatabaseSchema();
  }

  @Get('test-hashing')
  @ApiOperation({ summary: 'Probar hasheo según ejemplo proporcionado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Resultado de prueba de hasheo' })
  async testHashing() {
    return await this.authService.testHashing();
  }

  @Post('check-user-hashes')
  @ApiOperation({ summary: 'Verificar hashes de un usuario específico' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Hashes del usuario' })
  async checkUserHashes(@Body('cedula') cedula: string) {
    return await this.authService.checkUserHashes(cedula);
  }
}
