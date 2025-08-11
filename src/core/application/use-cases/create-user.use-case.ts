import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ICryptoService } from '../../domain/crypto.service.interface';
import { IUserCreateData } from '../../domain/interfaces/user.interface';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY, CRYPTO_SERVICE } from '../../application/tokens';

/**
 * Caso de uso: Crear Usuario
 * Contiene la lógica de negocio para crear un nuevo usuario
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CRYPTO_SERVICE)
    private readonly cryptoService: ICryptoService,
  ) {}

  /**
   * Ejecuta el caso de uso para crear un usuario
   */
  async execute(userData: IUserCreateData): Promise<{ success: boolean; message?: string; error?: string; userId?: number }> {
    try {
      // Validar que la cédula no exista
      const userExists = await this.userRepository.exists(userData.cedula);
      if (userExists) {
        return {
          success: false,
          error: 'Ya existe un usuario con esta cédula',
        };
      }

      // Validar datos requeridos
      if (!userData.cedula || !userData.nombre || !userData.apellido || !userData.password || !userData.clave) {
        return {
          success: false,
          error: 'Todos los campos requeridos deben estar presentes',
        };
      }

      // Validar formato de cédula (11 dígitos)
      if (userData.cedula.length !== 11 || !/^\d+$/.test(userData.cedula)) {
        return {
          success: false,
          error: 'La cédula debe tener exactamente 11 dígitos numéricos',
        };
      }

      // Validar formato de email si se proporciona
      if (userData.user_email && !this.isValidEmail(userData.user_email)) {
        return {
          success: false,
          error: 'El formato del email no es válido',
        };
      }

      // Preparar datos para el repositorio
      const repositoryData = {
        cedula: userData.cedula,
        nombre: userData.nombre,
        apellido: userData.apellido,
        password: this.cryptoService.calculateSHA256(userData.cedula + userData.password),
        codigo: this.cryptoService.calculateSHA256(userData.cedula + userData.clave),
        role: userData.role || 'Usuario',
        user_email: userData.user_email,
        telefono: userData.telefono,
        direccion: userData.direccion,
        celular: userData.celular,
        user_status: userData.user_status || 1,
        caja_id: userData.caja_id,
        tienda_id: userData.tienda_id,
        allow_multi_tienda: userData.allow_multi_tienda || '0',
        max_descuento: userData.max_descuento,
        close_caja: userData.close_caja || '0',
        user_account_email: userData.user_account_email,
        user_account_email_passw: userData.user_account_email_passw,
        comision_porciento: userData.comision_porciento,
        default_portalid: userData.default_portalid,
        nuevocampo: userData.nuevocampo,
        encargadoId: userData.encargadoId,
        passwchanged: '0',
        valido: '1',
      };

      // Crear el usuario
      const newUser = await this.userRepository.create(repositoryData);

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        userId: newUser.id,
      };

    } catch (error) {
      return {
        success: false,
        error: `Error interno del servidor: ${error.message}`,
      };
    }
  }

  /**
   * Valida el formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
