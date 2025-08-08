import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { AuthenticateUserUseCase } from './use-cases/authenticate-user.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { CashRequestRepository } from '../../infrastructure/repositories/cash-request.repository';
import { CryptoService } from '../../infrastructure/services/crypto.service';

// Tokens de inyección
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const CASH_REQUEST_REPOSITORY = 'CASH_REQUEST_REPOSITORY';
export const CRYPTO_SERVICE = 'CRYPTO_SERVICE';

/**
 * Módulo de Aplicación
 * Orquesta los casos de uso y conecta el dominio con la infraestructura
 */
@Module({
  providers: [
    // Casos de uso
    CreateUserUseCase,
    AuthenticateUserUseCase,
    
    // Repositorios (implementaciones)
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: CASH_REQUEST_REPOSITORY,
      useClass: CashRequestRepository,
    },
    
    // Servicios (implementaciones)
    {
      provide: CRYPTO_SERVICE,
      useClass: CryptoService,
    },
  ],
  exports: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    USER_REPOSITORY,
    CASH_REQUEST_REPOSITORY,
    CRYPTO_SERVICE,
  ],
})
export class ApplicationModule {}
