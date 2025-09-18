import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponsableRepository } from '../../core/domain/repositories/responsable.repository.interface';
import { GaColaboradoresEntity } from '../database/entities/ga-colaboradores.entity';

@Injectable()
export class ResponsableRepository implements IResponsableRepository {
  constructor(
    @InjectRepository(GaColaboradoresEntity)
    private readonly gaColaboradoresRepository: Repository<GaColaboradoresEntity>,
  ) {}

  async findAll(): Promise<any[]> {
    return await this.gaColaboradoresRepository.find({
      order: { id: 'ASC'}
    });
  }

  async findById(id: number): Promise<any> {
    return await this.gaColaboradoresRepository.findOne({
      where: { id }
    });
  }
}