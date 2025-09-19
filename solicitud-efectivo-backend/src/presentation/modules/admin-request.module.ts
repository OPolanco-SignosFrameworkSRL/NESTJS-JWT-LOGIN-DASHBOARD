import { Module } from '@nestjs/common';
import { AdminRequestController } from '../controllers/admin-request.controller';
import { UpdateRequestStatusUseCase } from '../../core/application/use-cases/update-request-status.use-case';
import { CashRequestModule } from './cash-request.module';

@Module({
  imports: [CashRequestModule],
  controllers: [AdminRequestController],
  providers: [UpdateRequestStatusUseCase],
  exports: [UpdateRequestStatusUseCase],
})
export class AdminRequestModule {}
