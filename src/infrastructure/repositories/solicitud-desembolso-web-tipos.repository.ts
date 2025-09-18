import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISolicitudDesembolsoWebTiposRepository } from '../../core/domain/repositories/solicitud-desembolso-web-tipos.repository.interface';
import { SolicitudDesembolsoWebTiposEntity } from '../database/entities/solicitud-desembolso-web-tipos.entity';

@Injectable()
export class SolicitudDesembolsoWebTiposRepository implements ISolicitudDesembolsoWebTiposRepository {
  constructor(
    @InjectRepository(SolicitudDesembolsoWebTiposEntity)
    private readonly solicitudDesembolsoWebTiposRepository: Repository<SolicitudDesembolsoWebTiposEntity>,
  ) {}

  async findAll(): Promise<SolicitudDesembolsoWebTiposEntity[]> {
    return await this.solicitudDesembolsoWebTiposRepository.find({
      order: { tipo_desc: 'ASC' }
    });
  }

  async findById(id: number): Promise<SolicitudDesembolsoWebTiposEntity> {
    return await this.solicitudDesembolsoWebTiposRepository.findOne({
      where: { id: id }
    });
  }
}
