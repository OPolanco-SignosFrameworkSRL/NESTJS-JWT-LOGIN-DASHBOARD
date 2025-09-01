import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../../core/domain/services/users.service';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../../infrastructure/database/entities/user-write.entity';
import { UsuarioRolEntity } from '../../infrastructure/database/entities/usuario-rol.entity';
import { RoleEntity } from '../../infrastructure/database/entities/role.entity';
import { AuthModule } from './auth.module';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from '../../core/application/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserWriteEntity, UsuarioRolEntity, RoleEntity]), AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService, 
    CryptoService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
