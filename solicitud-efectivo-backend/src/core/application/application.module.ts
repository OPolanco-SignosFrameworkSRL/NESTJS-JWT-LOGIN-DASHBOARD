import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { AuthenticateUserUseCase } from './use-cases/authenticate-user.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { CashRequestRepository } from '../../infrastructure/repositories/cash-request.repository';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { USER_REPOSITORY, CASH_REQUEST_REPOSITORY, CRYPTO_SERVICE } from './tokens';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../../infrastructure/database/entities/user-write.entity';
import { CashRequestEntity } from '../../infrastructure/database/entities/cash-request.entity';
import { CashRequestWriteEntity } from '../../infrastructure/database/entities/cash-request-write.entity';

// Tokens de inyección movidos a tokens.ts para evitar ciclos

/**
 * Módulo de Aplicación
 * Orquesta los casos de uso y conecta el dominio con la infraestructura
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserWriteEntity,
      CashRequestEntity,
      CashRequestWriteEntity,
    ]),
  ],
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
