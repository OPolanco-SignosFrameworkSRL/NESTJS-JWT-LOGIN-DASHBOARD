import { Injectable, Inject } from '@nestjs/common';
import { IDesembolsoService } from '../desembolso.service.interface';
import { IDesembolsoRepository } from '../repositories/desembolso.repository.interface';
import { CreateDesembolsoDto } from '../../application/dto/create-desembolso.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';
import { DesembolsoFiltersDto } from '../../application/dto/desembolso-filters.dto';

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

  async findAll(filters?: DesembolsoFiltersDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, ...otherFilters } = filters || {};
    const skip = (page - 1) * limit;

    const [desembolsos, total] = await this.desembolsoRepository.findAllWithPagination(
      { ...otherFilters, skip, take: limit }
    );
    
    const totalPages = Math.ceil(total / limit);

    return {
      data: desembolsos,
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
