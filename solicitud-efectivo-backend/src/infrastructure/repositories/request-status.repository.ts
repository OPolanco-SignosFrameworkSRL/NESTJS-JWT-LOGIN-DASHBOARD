import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SolicitudDesembolsoWebStatusEntity } from '../database/entities/solicitud-desembolso-web-status.entity';

@Injectable()
export class RequestStatusRepository {
  constructor(
    @InjectRepository(SolicitudDesembolsoWebStatusEntity)
    private readonly repo: Repository<SolicitudDesembolsoWebStatusEntity>,
  ) {}

  async findAndCount(page: number, limit: number, descripcion?: string) {
    const where = descripcion
      ? { descripcion: ILike(`%${descripcion}%`) }
      : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }
}


