import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudGeneralController } from '../controllers/solicitud-general.controller';
import { SolicitudGeneralService } from '../../core/domain/services/solicitud-general.service';
import { SolicitudGeneralEntity } from '../../infrastructure/database/entities/solicitud-general.entity';
import { SolicitudGeneralRepository } from '../../infrastructure/repositories/solicitud-general.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolicitudGeneralEntity,
    ]),
  ],
  controllers: [SolicitudGeneralController],
  providers: [
    SolicitudGeneralService,
    {
      provide: 'ISolicitudGeneralService',
      useClass: SolicitudGeneralService,
    },
    {
      provide: 'ISolicitudGeneralRepository',
      useClass: SolicitudGeneralRepository,
    },
  ],
  exports: [
    SolicitudGeneralService,
    {
      provide: 'ISolicitudGeneralService',
      useClass: SolicitudGeneralService,
    },
  ],
})
export class SolicitudGeneralModule {} 