import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRequestController } from '../controllers/cash-request.controller';
import { CashRequestService } from '../../core/domain/services/cash-request.service';
import { CashRequestEntity } from '../../infrastructure/database/entities/cash-request.entity';
import { CashRequestWriteEntity } from '../../infrastructure/database/entities/cash-request-write.entity';
import { CashRequestRepository, CashRequestWriteRepository } from '../../infrastructure/repositories/cash-request.repository';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CashRequestEntity,
      CashRequestWriteEntity,
      UserEntity,
    ]),
  ],
  controllers: [CashRequestController],
  providers: [
    CashRequestService,
    {
      provide: 'ICashRequestService',
      useClass: CashRequestService,
    },
    {
      provide: 'ICashRequestRepository',
      useClass: CashRequestRepository,
    },
    {
      provide: 'ICashRequestWriteRepository',
      useClass: CashRequestWriteRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [
    CashRequestService,
    {
      provide: 'ICashRequestService',
      useClass: CashRequestService,
    },
  ],
})
export class CashRequestModule {} 