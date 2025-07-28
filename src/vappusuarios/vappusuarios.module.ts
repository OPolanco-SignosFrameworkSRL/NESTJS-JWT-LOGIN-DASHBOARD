import { Module } from '@nestjs/common';
import { VappusuariosController } from './vappusuarios.controller';
import { VappusuariosService } from './vappusuarios.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VappusuariosController],
  providers: [VappusuariosService],
})
export class VappusuariosModule {}
