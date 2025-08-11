import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthService } from '../../core/domain/services/auth.service';
import { CryptoService } from '../../infrastructure/services/crypto.service';

// Entidades de base de datos
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../../infrastructure/database/entities/user-write.entity';

// Casos de uso y servicios
import { ApplicationModule } from '../../core/application/application.module';

/**
 * Módulo de Autenticación
 * Configura la autenticación JWT y los casos de uso relacionados
 */
@Module({
  imports: [
    // Módulo de aplicación (casos de uso)
    ApplicationModule,
    
    // Módulos de NestJS
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, UserWriteEntity]),
    
    // Configuración JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CryptoService],
  exports: [ApplicationModule, AuthService],
})
export class AuthModule {}
