import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { VappusuariosModule } from './vappusuarios/vappusuarios.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, VappusuariosModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
