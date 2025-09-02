import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticateUserUseCase } from '../../core/application/use-cases/authenticate-user.use-case';
import { LoginDto } from '../../core/application/dto/login.dto';
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
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Autentica un usuario y genera un token JWT
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthGuard('jwt')) // ← Agregar candado
 // @ApiBearerAuth() // ← Agregar candado en Swagger
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.cedula,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT usando AuthService.login
    const loginResponse = await this.authService.login(user);

    // Retornar solo el token
    return loginResponse.access_token;
  }

  /**
   * ENDPOINT TEMPORAL - Crear usuario inicial sin autenticación
   * ⚠️ SOLO PARA DESARROLLO - Eliminar en producción
   */
  /* @Post('create-initial-user')
  @ApiOperation({ summary: 'Crear usuario inicial (temporal)' })
  @ApiResponse({ status: 201, description: 'Usuario inicial creado' })
  async createInitialUser() {
    const userData = {
      cedula: "40208712480",
      nombre: "Admin",
      apellido: "Sistema",
      fullname: "Admin Sistema",
      password: "123456",
      clave: "0000",
      user_email: "admin@sistema.com",
      telefono: "8091234567",
      direccion: "Oficina Central",
      celular: "8091234567",
      user_status: 1,
      caja_id: "1",
      tienda_id: "1",
      allow_multi_tienda: "0",
      max_descuento: "0",
      close_caja: "1",
      user_account_email: "admin@sistema.com",
      user_account_email_passw: "123456",
      comision_porciento: "0",
      default_portalid: "1",
      nuevocampo: "",
      encargadoId: "1"
    };

    return await this.authService.createUser(userData);
  } */

  /**
   * ENDPOINT TEMPORAL - Verificar usuario sin autenticación
   * ⚠️ SOLO PARA DESARROLLO - Eliminar en producción
   
  @Post('check-user')
  @ApiOperation({ summary: 'Verificar usuario (temporal)' })
  async checkUser(@Body() body: { cedula: string }) {
    return await this.authService.checkUserInfo(body.cedula);
  }
*/
  /**
   * Verifica el token JWT y retorna información del usuario
   */
  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar token JWT' })
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async verifyToken(@Request() req) {
    return {
      token: {
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
