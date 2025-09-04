// src/presentation/modules/solicitud-efectivo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudEfectivoController } from '../controllers/solicitud-efectivo.controller';
import { AdminSolicitudEfectivoController } from '../controllers/admin-solicitud-efectivo.controller';
import { SolicitudEfectivoService } from '../../core/domain/services/solicitud-efectivo.service';
import { SolicitudEfectivoEntity } from '../../infrastructure/database/entities/solicitud-efectivo.entity';
import { IntegranteDesembolsoEntity } from '../../infrastructure/database/entities/integrante-desembolso.entity';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { SolicitudTipoEntity } from '../../infrastructure/database/entities/solicitud-tipo.entity';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudEfectivoEntity, IntegranteDesembolsoEntity, UserEntity, SolicitudTipoEntity]),
    UsersModule, // Para usar UsersService
  ],
  controllers: [SolicitudEfectivoController, AdminSolicitudEfectivoController],
  providers: [SolicitudEfectivoService],
  exports: [SolicitudEfectivoService],
})
export class SolicitudEfectivoModule {}