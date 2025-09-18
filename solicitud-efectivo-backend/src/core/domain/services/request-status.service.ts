import { Injectable } from '@nestjs/common';
import { RequestStatusRepository } from '../../../infrastructure/repositories/request-status.repository';
import { RequestStatusQueryDto } from '../../application/dto/request-status-query.dto';

@Injectable()
export class RequestStatusService {
  constructor(private readonly repo: RequestStatusRepository) {}

  async list(query: RequestStatusQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const { data, total } = await this.repo.findAndCount(page, limit, query.descripcion);
    const totalPages = Math.ceil(total / limit) || 1;
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}


