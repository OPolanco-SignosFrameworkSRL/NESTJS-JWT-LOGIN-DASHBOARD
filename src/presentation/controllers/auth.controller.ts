import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserUseCase } from '../../core/application/use-cases/create-user.use-case';
import { AuthenticateUserUseCase } from '../../core/application/use-cases/authenticate-user.use-case';
import { LoginDto } from '../../core/application/dto/login.dto';
import { RegisterDto } from '../../core/application/dto/register.dto';
import { IUserPayload, IUser } from '../../core/domain/interfaces/user.interface';
import { AuthService } from '../../core/domain/services/auth.service';

/**
 * Controlador de Autenticación
 * Maneja las operaciones de autenticación y autorización
 * Sigue Clean Architecture - solo maneja HTTP, no lógica de negocio
 */
@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Registra un nuevo usuario
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Usuario ya existe' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.createUserUseCase.execute(registerDto);

    if (!result.success) {
      return {
        data: {
          success: false,
          error: result.error,
        },
        statusCode: 201,
        message: 'Operación exitosa',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      data: {
        success: true,
        message: result.message,
        userId: result.userId,
      },
      statusCode: 201,
      message: 'Operación exitosa',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Autentica un usuario y genera un token JWT
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    // Usar AuthService.validateUser en lugar del caso de uso defectuoso
    const user = await this.authService.validateUser(
      loginDto.cedula,
      loginDto.password,
    );

    if (!user) {
      return {
        data: {
          success: false,
          error: 'Credenciales inválidas',
        },
        statusCode: 200,
        message: 'Operación exitosa',
        timestamp: new Date().toISOString(),
      };
    }

    // Generar token JWT usando AuthService.login
    const loginResponse = await this.authService.login(user);

    // Crear objeto de usuario de manera segura
    const userData: any = {
      id: user.id,
      cedula: user.cedula,
      nombre: user.nombre,
      apellido: user.apellido,
      fullname: user.fullname,
      role: user.role,
      user_email: user.user_email,
      valido: user.valido,
      division: user.division,
      cargo: user.cargo,
      dependencia: user.dependencia,
      recinto: user.recinto,
      estado: user.estado,
    };

    // Agregar telefono solo si existe
    if ('telefono' in user && user.telefono) {
      userData.telefono = user.telefono;
    }

    return {
      data: {
        success: true,
        access_token: loginResponse.access_token,
        user: userData,
        expires_in: loginResponse.expires_in,
      },
      statusCode: 200,
      message: 'Operación exitosa',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Verifica el token JWT y retorna información del usuario
   */
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@Request() req) {
    return {
      data: {
        success: true,
        user: req.user,
      },
      statusCode: 200,
      message: 'Operación exitosa',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Verifica si el token JWT es válido
   */
  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar token JWT' })
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async verifyToken(@Request() req) {
    return {
      data: {
        success: true,
        message: 'Token válido',
        user: req.user,
      },
      statusCode: 200,
      message: 'Operación exitosa',
      timestamp: new Date().toISOString(),
    };
  }
}
