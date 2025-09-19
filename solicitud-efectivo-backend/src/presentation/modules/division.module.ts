import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionController } from '../controllers/division.controller';
import { DivisionService } from '../../core/domain/services/division.service';
import { DivisionRepository } from '../../infrastructure/repositories/division.repository';
import { DivisionEntity } from '../../infrastructure/database/entities/division.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DivisionEntity]),
  ],
  controllers: [DivisionController],
  providers: [
    DivisionService,
    {
      provide: 'IDivisionRepository',
      useClass: DivisionRepository,
    },
  ],
  exports: [DivisionService],
})
export class DivisionModule {}
