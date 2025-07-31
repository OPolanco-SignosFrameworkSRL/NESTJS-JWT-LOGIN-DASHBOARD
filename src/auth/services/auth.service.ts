import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserWrite } from '../../entities/user-write.entity';
import {
  IUser,
  IUserPayload,
  ILoginResponse,
  IUserCreateData,
  UserRole,
} from '../../common/interfaces/user.interface';
import { CryptoService } from '../../common/services/crypto.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  

  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserWrite)
    private readonly userWriteRepository: Repository<UserWrite>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Valida las credenciales del usuario (cédula y contraseña).
   * La validación del campo 'codigo' se ha eliminado de este flujo de login principal,
   * ya que 'clave' no es parte del LoginDto y 'codigo' ahora se deriva de una clave
   * proporcionada solo durante el registro.
   */
  async validateUser(cedula: string, password: string): Promise<IUser | null> {
    if (!cedula || !password) {
      return null;
    }

    try {
      // Buscar usuario en la vista para obtener datos completos
      const user = await this.userRepository.findOne({
        where: { cedula, valido: true },
      });

      if (!user) {
        this.logger.warn(`Usuario no encontrado: ${cedula}`);
        return null;
      }

      // Buscar usuario en la tabla real para obtener la contraseña
      const userWrite = await this.userWriteRepository.findOne({
        where: { cedula },
      });

      if (!userWrite) {
        this.logger.warn(
          `Usuario no encontrado en tabla de escritura: ${cedula}`,
        );
        return null;
      }

      // Validar contraseña
      const hashedPassword = this.cryptoService.calculateSHA256(password);
      if (hashedPassword !== userWrite.password) {
        this.logger.warn(`Contraseña inválida para usuario: ${cedula}`);
        return null;
      }

      // La validación del 'codigo' (clave dinámica) se ha eliminado de aquí.
      // Si el 'codigo' se usará para alguna otra validación (ej. 2FA, API Key),
      // esa lógica debería implementarse en un punto separado o con un DTO de login diferente.

      // Usuario válido
      return {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        fullname: user.getFullName(),
        role: user.role as UserRole,
        user_email: user.user_email,
        division: user.division,
        cargo: user.cargo,
        dependencia: user.dependencia,
        recinto: user.recinto,
        estado: user.estado,
        valido: user.valido,
      };
    } catch (error) {
      this.logger.error(`Error validando usuario ${cedula}:`, error);
      return null;
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * Ahora el campo 'codigo' se genera hasheando la cédula y la clave proporcionada por el usuario.
   */
  async createUser(data: IUserCreateData): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    userId?: number;
  }> {
    try {
      // Verificar si el usuario ya existe en la vista (para mostrar datos completos)
      const existingUser = await this.userRepository.findOne({
        where: { cedula: data.cedula },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Ya existe un usuario con esta cédula',
        };
      }

      // Generar el hash para el campo 'codigo' usando la cédula y la clave proporcionada por el usuario
      const codigoHash = this.cryptoService.calculateSHA256(
        data.cedula + data.clave,
      );

      // Hash de la contraseña del usuario
      const hashedPassword = this.cryptoService.calculateSHA256(data.password);

      // Crear el nuevo usuario en la tabla real
      const newUser = this.userWriteRepository.create({
        cedula: data.cedula,
        nombre: data.nombre,
        apellido: data.apellido,
        codigo: null,
        password: codigoHash,
        role: data.role || 'Usuario',
        user_email: data.user_email,
        valido: true,
        // ❌ REMOVER: division, cargo, dependencia, recinto, estado
      });

      const savedUser = await this.userWriteRepository.save(newUser);

      this.logger.log(`Usuario creado exitosamente: ${data.cedula}`);

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        userId: savedUser[0].id,
      };
    } catch (error) {
      this.logger.error(`Error creando usuario ${data.cedula}:`, error);
      return {
        success: false,
        error: `Error interno del servidor: ${error.message}`,
      };
    }
  }

  /**
   * Genera el token JWT para el usuario autenticado
   */
  async login(user: IUser): Promise<ILoginResponse> {
    const payload: IUserPayload = {
      username: user.cedula,
      sub: user.id,
      fullname: user.fullname,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');

    this.logger.log(`Login exitoso para usuario: ${user.cedula}`);

    return {
      access_token: token,
      user: {
        id: user.id,
        cedula: user.cedula,
        fullname: user.fullname,
        apellido: user.apellido,
        role: user.role,
        user_email: user.user_email,
        division: user.division,
        cargo: user.cargo,
        dependencia: user.dependencia,
        recinto: user.recinto,
      },
      expires_in: this.parseExpiresIn(expiresIn),
    };
  }

  /**
   * Obtiene información del usuario para debugging.
   * Ahora 'codigo' mostrará el hash de la clave dinámica generada a partir de cedula + clave_proporcionada.
   */
  async checkUserInfo(cedula: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { cedula } });

      if (!user) {
        return { error: 'Usuario no encontrado' };
      }

      // No podemos recrear el 'expectedHash' para 'codigo' aquí sin la 'clave' original
      // que fue proporcionada durante el registro.
      // El 'codigo' almacenado es el hash de (cedula + clave_original_de_registro).

      return {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        codigo: user.codigo, // Este es ahora el hash de (cedula + clave_proporcionada_en_registro)
        valido: user.valido,
        role: user.role,
        user_email: user.user_email,
        division: user.division,
        cargo: user.cargo,
        dependencia: user.dependencia,
        recinto: user.recinto,
        estado: user.estado,
        debug: {
          message:
            'El campo "codigo" ahora contiene el hash de la combinación de la cédula y la clave proporcionada por el usuario durante el registro.',
          // No hay 'hashInput' o 'expectedHash' para comparar aquí sin la clave original.
        },
      };
    } catch (error) {
      this.logger.error(
        `Error obteniendo información del usuario ${cedula}:`,
        error,
      );
      return { error: 'Error interno del servidor' };
    }
  }

  /**
   * Verifica si un token JWT es válido
   */
  async verifyToken(token: string): Promise<IUserPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('Error verificando token:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }

  /**
   * Convierte expiresIn string a segundos
   */
  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 24 * 60 * 60; // 24 horas por defecto
    }
  }
}