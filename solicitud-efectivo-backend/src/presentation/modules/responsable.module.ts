import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsableController } from '../controllers/responsable.controller';
import { ResponsableService } from '../../core/domain/services/responsable.service';
import { ResponsableRepository } from '../../infrastructure/repositories/responsable.repository';
import { GaColaboradoresEntity } from '../../infrastructure/database/entities/ga-colaboradores.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GaColaboradoresEntity]),
  ],
  controllers: [ResponsableController],
  providers: [
    ResponsableService,
    {
      provide: 'IResponsableRepository',
      useClass: ResponsableRepository,
    },
  ],
  exports: [ResponsableService],
})
export class ResponsableModule {}