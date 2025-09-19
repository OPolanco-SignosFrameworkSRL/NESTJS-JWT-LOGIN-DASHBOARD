import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesembolsoController } from '../controllers/desembolso.controller';
import { DesembolsoService } from '../../core/domain/services/desembolso.service';
import { DesembolsoRepository } from '../../infrastructure/repositories/desembolso.repository';
import { DesembolsoEntity } from '../../infrastructure/database/entities/desembolso.entity';
import { SolicitudEfectivoEntity } from '../../infrastructure/database/entities/solicitud-efectivo.entity';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { GaColaboradoresEntity } from '../../infrastructure/database/entities/ga-colaboradores.entity';
import { CreateDesembolsoUseCase } from '../../core/application/use-cases/create-desembolso.use-case';
import { CashRequestModule } from './cash-request.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DesembolsoEntity,
      SolicitudEfectivoEntity,
      UserEntity,
      GaColaboradoresEntity,
    ]),
    forwardRef(() => CashRequestModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [DesembolsoController],
  providers: [
    {
      provide: 'IDesembolsoService',
      useClass: DesembolsoService,
    },
    {
      provide: 'IDesembolsoRepository',
      useClass: DesembolsoRepository,
    },
    CreateDesembolsoUseCase,
  ],
  exports: [
    'IDesembolsoService',
    'IDesembolsoRepository',
  ],
})
export class DesembolsoModule {}
