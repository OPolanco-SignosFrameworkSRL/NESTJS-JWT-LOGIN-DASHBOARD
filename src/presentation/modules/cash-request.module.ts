import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRequestController } from '../controllers/cash-request.controller';
import { CashRequestService } from '../../core/domain/services/cash-request.service';
import { CashRequestRepository } from '../../infrastructure/repositories/cash-request.repository';
import { CashRequestEntity } from '../../infrastructure/database/entities/cash-request.entity';
import { CashRequestWriteEntity } from '../../infrastructure/database/entities/cash-request-write.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CashRequestEntity, CashRequestWriteEntity]),
  ],
  controllers: [CashRequestController],
  providers: [CashRequestService, CashRequestRepository],
  exports: [CashRequestService],
})
export class CashRequestModule {} 