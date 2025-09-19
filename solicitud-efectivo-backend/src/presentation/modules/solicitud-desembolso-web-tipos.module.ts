import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudDesembolsoWebTiposController } from '../controllers/solicitud-desembolso-web-tipos.controller';
import { SolicitudDesembolsoWebTiposService } from '../../core/domain/services/solicitud-desembolso-web-tipos.service';
import { SolicitudDesembolsoWebTiposRepository } from '../../infrastructure/repositories/solicitud-desembolso-web-tipos.repository';
import { SolicitudDesembolsoWebTiposEntity } from '../../infrastructure/database/entities/solicitud-desembolso-web-tipos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudDesembolsoWebTiposEntity]),
  ],
  controllers: [SolicitudDesembolsoWebTiposController],
  providers: [
    SolicitudDesembolsoWebTiposService,
    {
      provide: 'ISolicitudDesembolsoWebTiposRepository',
      useClass: SolicitudDesembolsoWebTiposRepository,
    },
  ],
  exports: [SolicitudDesembolsoWebTiposService],
})
export class SolicitudDesembolsoWebTiposModule {}
