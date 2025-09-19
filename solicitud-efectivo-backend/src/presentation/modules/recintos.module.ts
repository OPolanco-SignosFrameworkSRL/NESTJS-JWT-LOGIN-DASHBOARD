import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecintosController } from '../controllers/recintos.controller';
import { RecintosService } from '../../core/domain/services/recintos.service';
import { RecintosRepository } from '../../infrastructure/repositories/recintos.repository';
import { RecintosEntity } from '../../infrastructure/database/entities/recintos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecintosEntity]),
  ],
  controllers: [RecintosController],
  providers: [
    RecintosService,
    {
      provide: 'IRecintosRepository',
      useClass: RecintosRepository,
    },
  ],
  exports: [RecintosService],
})
export class RecintosModule {}
