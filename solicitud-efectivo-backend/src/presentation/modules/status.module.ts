import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusController } from '../controllers/status.controller';
import { StatusService } from '../../core/domain/services/status.service';
import { StatusRepository } from '../../infrastructure/repositories/status.repository';
import { StatusEntity } from '../../infrastructure/database/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatusEntity]),
  ],
  controllers: [StatusController],
  providers: [
    StatusService,
    StatusRepository,
  ],
  exports: [
    StatusService,
    StatusRepository,
  ],
})
export class StatusModule {}
