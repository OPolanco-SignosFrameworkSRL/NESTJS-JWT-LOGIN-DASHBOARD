import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPagoController } from '../controllers/tipo-pago.controller';
import { TipoPagoService } from '../../core/domain/services/tipo-pago.service';
import { TipoPagoRepository } from '../../infrastructure/repositories/tipo-pago.repository';
import { TipoPagoEntity } from '../../infrastructure/database/entities/tipo-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoPagoEntity]),
  ],
  controllers: [TipoPagoController],
  providers: [
    TipoPagoService,
    {
      provide: 'ITipoPagoRepository',
      useClass: TipoPagoRepository,
    },
  ],
  exports: [TipoPagoService],
})
export class TipoPagoModule {}
