import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../../core/domain/services/users.service';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserWriteEntity } from '../../infrastructure/database/entities/user-write.entity';
import { AuthModule } from './auth.module';
import { CryptoService } from '../../infrastructure/services/crypto.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserWriteEntity]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, CryptoService],
  exports: [UsersService],
})
export class UsersModule {}
