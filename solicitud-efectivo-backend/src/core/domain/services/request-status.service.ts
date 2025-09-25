import { Injectable } from '@nestjs/common';
import { RequestStatusRepository } from '../../../infrastructure/repositories/request-status.repository';
import { RequestStatusQueryDto } from '../../application/dto/request-status-query.dto';

@Injectable()
export class RequestStatusService {
  constructor(private readonly repo: RequestStatusRepository) {}

  async list(query: RequestStatusQueryDto) {
    const page = query.page;
    const limit = query.limit;

    // Si no se especifican page y limit, devolver todos los registros filtrados sin paginar
    if (page === undefined || limit === undefined) {
      const { data, total } = await this.repo.findAndCount(undefined, undefined, query.descripcion);
      return {
        data,
        total,
        page: 1,
        limit: total,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
    }

    // Con paginación
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


