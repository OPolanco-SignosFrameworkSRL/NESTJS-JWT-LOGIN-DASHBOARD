import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestStatusController } from '../controllers/request-status.controller';
import { RequestStatusService } from '../../core/domain/services/request-status.service';
import { RequestStatusRepository } from '../../infrastructure/repositories/request-status.repository';
import { SolicitudDesembolsoWebStatusEntity } from '../../infrastructure/database/entities/solicitud-desembolso-web-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitudDesembolsoWebStatusEntity])],
  controllers: [RequestStatusController],
  providers: [RequestStatusService, RequestStatusRepository],
  exports: [RequestStatusService],
})
export class RequestStatusModule {}


