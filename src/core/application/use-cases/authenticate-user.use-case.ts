import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ICryptoService } from '../../domain/crypto.service.interface';
import { IUser } from '../../domain/interfaces/user.interface';
import { USER_REPOSITORY, CRYPTO_SERVICE } from '../tokens';

/**
 * Caso de uso: Autenticar Usuario
 * Contiene la lógica de negocio para autenticar un usuario
 */
@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CRYPTO_SERVICE)
    private readonly cryptoService: ICryptoService,
  ) {}

  /**
   * Ejecuta el caso de uso para autenticar un usuario
   */
  async execute(cedula: string, password: string): Promise<IUser | null> {
    try {
      // Validar datos de entrada
      if (!cedula || !password) {
        return null;
      }

      // Buscar usuario por cédula
      const user = await this.userRepository.findByCedula(cedula);
      if (!user) {
        return null;
      }

      // Verificar que el usuario esté activo
      if (!user.isActive()) {
        return null;
      }

      // Verificar contraseña
      const hashedPassword = this.cryptoService.calculateSHA256(cedula + password);
      
      // Validar la contraseña usando el repositorio
      const isValidPassword = await this.validatePassword(cedula, hashedPassword);
      
      if (!isValidPassword) {
        return null;
      }

      // Retornar usuario autenticado
      const userData: any = {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        fullname: user.getFullName(),
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

      return userData;

    } catch (error) {
      return null;
    }
  }

  /**
   * Valida la contraseña del usuario
   * Esta implementación ahora valida correctamente la contraseña
   */
  private async validatePassword(cedula: string, hashedPassword: string): Promise<boolean> {
    try {
      // Usar el método del repositorio para validar las credenciales
      return await this.userRepository.validateCredentials(cedula, hashedPassword);
    } catch (error) {
      return false;
    }
  }
}
