import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosNoLiquidadosController } from '../controllers/pagos-no-liquidados.controller';
import { PagoNoLiquidadoService } from '../../core/domain/services/pago-no-liquidado.service';
import { PagoNoLiquidadoRepository } from '../../infrastructure/repositories/pago-no-liquidado.repository';
import { PagoNoLiquidadoEntity } from '../../infrastructure/database/entities/pago-no-liquidado.entity';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { TipoPagoEntity } from '../../infrastructure/database/entities/tipo-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PagoNoLiquidadoEntity,
      UserEntity,
      TipoPagoEntity,
    ]),
  ],
  controllers: [PagosNoLiquidadosController],
  providers: [
    PagoNoLiquidadoService,
    PagoNoLiquidadoRepository,
  ],
  exports: [
    PagoNoLiquidadoService,
    PagoNoLiquidadoRepository,
  ],
})
export class PagosNoLiquidadosModule {}
