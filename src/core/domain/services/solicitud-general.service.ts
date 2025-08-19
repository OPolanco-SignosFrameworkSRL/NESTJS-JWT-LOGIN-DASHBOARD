import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ISolicitudGeneralService } from '../solicitud-general.service.interface';
import { ISolicitudGeneralResponse, ISolicitudGeneralFilters, ISolicitudGeneralStats, SolicitudStatus } from '../solicitud-general.interface';
import { UserRole } from '../user.interface';
import { ISolicitudGeneralRepository } from '../repositories/solicitud-general.repository.interface';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class SolicitudGeneralService implements ISolicitudGeneralService {
  constructor(
    @Inject('ISolicitudGeneralRepository')
    private readonly solicitudGeneralRepository: ISolicitudGeneralRepository,
  ) {}

  async findAll(filters?: ISolicitudGeneralFilters): Promise<PaginatedResponseDto<ISolicitudGeneralResponse>> {
    const { page = 1, limit = 10, ...otherFilters } = filters || {};
    const skip = (page - 1) * limit;

    const [solicitudes, total] = await this.solicitudGeneralRepository.findAllWithPagination(
      { ...otherFilters, skip, take: limit }
    );
    
    const totalPages = Math.ceil(total / limit);

    return {
      data: this.mapToResponse(solicitudes),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  async findById(id: number): Promise<ISolicitudGeneralResponse | null> {
    const solicitud = await this.solicitudGeneralRepository.findById(id);
    if (!solicitud) return null;

    const responses = this.mapToResponse([solicitud]);
    return responses[0];
  }

  async findByUser(userId: number): Promise<ISolicitudGeneralResponse[]> {
    const solicitudes = await this.solicitudGeneralRepository.findByUser(userId);
    return this.mapToResponse(solicitudes);
  }

  async findByFilters(filters: ISolicitudGeneralFilters): Promise<ISolicitudGeneralResponse[]> {
    const solicitudes = await this.solicitudGeneralRepository.findByFilters(filters);
    return this.mapToResponse(solicitudes);
  }

  async getStats(): Promise<ISolicitudGeneralStats> {
    return await this.solicitudGeneralRepository.getStats();
  }

  async approve(
    id: number,
    currentUser: { id: number; role: UserRole },
    notes?: string
  ): Promise<ISolicitudGeneralResponse> {
    // Solo admins pueden aprobar
    if (currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Solo los administradores pueden aprobar solicitudes');
    }

    const existingSolicitud = await this.solicitudGeneralRepository.findById(id);
    if (!existingSolicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (existingSolicitud.solicitud_status !== SolicitudStatus.PENDIENTE) {
      throw new BadRequestException('Solo se pueden aprobar solicitudes pendientes');
    }

    // Nota: Como es una vista, no podemos actualizar directamente
    // Aquí deberías implementar la lógica para actualizar la tabla base
    // Por ahora, retornamos la solicitud como si estuviera aprobada
    
    const responses = this.mapToResponse([existingSolicitud]);
    return responses[0];
  }

  async reject(
    id: number,
    currentUser: { id: number; role: UserRole },
    notes?: string
  ): Promise<ISolicitudGeneralResponse> {
    // Solo admins pueden rechazar
    if (currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Solo los administradores pueden rechazar solicitudes');
    }

    const existingSolicitud = await this.solicitudGeneralRepository.findById(id);
    if (!existingSolicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (existingSolicitud.solicitud_status !== SolicitudStatus.PENDIENTE) {
      throw new BadRequestException('Solo se pueden rechazar solicitudes pendientes');
    }

    // Nota: Como es una vista, no podemos actualizar directamente
    // Aquí deberías implementar la lógica para actualizar la tabla base
    // Por ahora, retornamos la solicitud como si estuviera rechazada
    
    const responses = this.mapToResponse([existingSolicitud]);
    return responses[0];
  }

  private mapToResponse(solicitudes: any[]): ISolicitudGeneralResponse[] {
    return solicitudes.map(solicitud => ({
      id: solicitud.id,
      fechacreada: solicitud.fechacreada,
      solicitada_porid: solicitud.solicitada_porid,
      solicitud_tipo: solicitud.solicitud_tipo,
      solicitud_status: solicitud.solicitud_status,
      monto_solicitado: solicitud.monto_solicitado,
      departamento: solicitud.departamento,
      concepto: solicitud.concepto,
      razon_rechazo: solicitud.razon_rechazo,
      usuarionombre: solicitud.usuarionombre,
      produccion: solicitud.produccion,
    }));
  }
} 