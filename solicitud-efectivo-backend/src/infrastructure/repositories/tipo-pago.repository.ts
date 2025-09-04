import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITipoPagoRepository } from '../../core/domain/repositories/tipo-pago.repository.interface';
import { TipoPagoEntity } from '../database/entities/tipo-pago.entity';

@Injectable()
export class TipoPagoRepository implements ITipoPagoRepository {
  constructor(
    @InjectRepository(TipoPagoEntity)
    private readonly tipoPagoRepository: Repository<TipoPagoEntity>,
  ) {}

  async findAll(): Promise<any[]> {
    return await this.tipoPagoRepository.find({
      order: { tipo_desc: 'ASC' }
    });
  }

  async findById(id: number): Promise<any> {
    return await this.tipoPagoRepository.findOne({
      where: { pago_tipo: id }
    });
  }
}
