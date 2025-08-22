import { DesembolsoFiltersDto } from '../../core/application/dto/desembolso-filters.dto';
import { PaginatedResponseDto } from '../../core/application/dto/pagination.dto';

export interface IDesembolsoService {
  createDesembolso(
    createDesembolsoDto: any,
    currentUser: { sub: number; role: string }
  ): Promise<any>;
  
  findAll(filters?: DesembolsoFiltersDto): Promise<PaginatedResponseDto<any>>;
  
  findById(id: number): Promise<any>;
  
  findBySolicitud(solicitudId: number): Promise<any[]>;
  
  findByResponsable(responsableId: number): Promise<any[]>;
}

