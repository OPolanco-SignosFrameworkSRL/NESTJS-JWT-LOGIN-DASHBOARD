import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRequestController } from '../controllers/cash-request.controller';
import { CashRequestService } from '../../core/domain/services/cash-request.service';
import { CashRequestRepository } from '../../infrastructure/repositories/cash-request.repository';
import { CASH_REQUEST_REPOSITORY } from '../../core/application/tokens';
import { CashRequestEntity } from '../../infrastructure/database/entities/cash-request.entity';
import { CashRequestWriteEntity } from '../../infrastructure/database/entities/cash-request-write.entity';
import { ApplicationModule } from '../../core/application/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CashRequestEntity, CashRequestWriteEntity]),
    ApplicationModule,
  ],
  controllers: [CashRequestController],
  providers: [
    // Servicio expuesto bajo el token que consume el controlador
    {
      provide: 'ICashRequestService',
      useClass: CashRequestService,
    },
    {
      provide: CASH_REQUEST_REPOSITORY,
      useClass: CashRequestRepository,
    },
  ],
  exports: [
    'ICashRequestService',
    CASH_REQUEST_REPOSITORY,
  ],
})
export class CashRequestModule {} 