import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosNoLiquidadosController } from '../controllers/pagos-no-liquidados.controller';
import { PagoNoLiquidadoService } from '../../core/domain/services/pago-no-liquidado.service';
import { PagoNoLiquidadoRepository } from '../../infrastructure/repositories/pago-no-liquidado.repository';
import { PagoNoLiquidadoEntity } from '../../infrastructure/database/entities/pago-no-liquidado.entity';
import { PagoNoLiquidadoAdjuntoEntity } from '../../infrastructure/database/entities/pago-no-liquidado-adjunto.entity';
import { DivisionEntity } from '../../infrastructure/database/entities/division.entity';
import { GaColaboradoresEntity } from '../../infrastructure/database/entities/ga-colaboradores.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PagoNoLiquidadoEntity,
      PagoNoLiquidadoAdjuntoEntity,
      DivisionEntity,
      GaColaboradoresEntity,
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
