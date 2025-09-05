import { Injectable, Inject } from '@nestjs/common';
import { IDesembolsoService } from '../desembolso.service.interface';
import { IDesembolsoRepository } from '../repositories/desembolso.repository.interface';
import { CreateDesembolsoDto } from '../../application/dto/create-desembolso.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class DesembolsoService implements IDesembolsoService {
  constructor(
    @Inject('IDesembolsoRepository')
    private readonly desembolsoRepository: IDesembolsoRepository,
  ) {}

  async createDesembolso(
    createDesembolsoDto: CreateDesembolsoDto,
    currentUser: { sub: number; role: string }
  ): Promise<any> {
    // Este método se maneja directamente en el UseCase
    throw new Error('Use CreateDesembolsoUseCase instead');
  }

  async findAll(pagination?: PaginationDto): Promise<PaginatedResponseDto<any>> {
    const desembolsos = await this.desembolsoRepository.findAll();

    // Si no se proporciona paginación, devolver todos los resultados en formato paginado
    if (!pagination || (!pagination.page && !pagination.limit)) {
      return {
        data: desembolsos,
        total: desembolsos.length,
        page: 1,
        limit: desembolsos.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      };
    }

    // Aplicar paginación
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const paginatedDesembolsos = desembolsos.slice(skip, skip + limit);
    const total = desembolsos.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedDesembolsos,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  async findById(id: number): Promise<any> {
    return await this.desembolsoRepository.findById(id);
  }

  async findBySolicitud(solicitudId: number): Promise<any[]> {
    return await this.desembolsoRepository.findBySolicitud(solicitudId);
  }

  async findByResponsable(responsableId: number): Promise<any[]> {
    return await this.desembolsoRepository.findByResponsable(responsableId);
  }
}
