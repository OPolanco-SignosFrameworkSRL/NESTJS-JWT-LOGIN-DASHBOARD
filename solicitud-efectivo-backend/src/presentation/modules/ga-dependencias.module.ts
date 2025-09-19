import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GaDependenciasController } from '../controllers/ga-dependencias.controller';
import { GaDependenciasService } from '../../core/domain/services/ga-dependencias.service';
import { GaDependenciasRepository } from '../../infrastructure/repositories/ga-dependencias.repository';
import { GaDependenciasEntity } from '../../infrastructure/database/entities/ga-dependencias.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GaDependenciasEntity]),
  ],
  controllers: [GaDependenciasController],
  providers: [
    GaDependenciasService,
    {
      provide: 'IGaDependenciasRepository',
      useClass: GaDependenciasRepository,
    },
  ],
  exports: [GaDependenciasService],
})
export class GaDependenciasModule {}
