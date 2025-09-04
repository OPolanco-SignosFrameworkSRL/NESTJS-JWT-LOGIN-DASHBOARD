import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PagoNoLiquidadoRepository, PagosNoLiquidadosResult } from '../../../infrastructure/repositories/pago-no-liquidado.repository';
import { PagoNoLiquidadoQueryDto } from '../../application/dto/pago-no-liquidado-query.dto';
import { PagoNoLiquidadoResponseDto, PagosNoLiquidadosListResponseDto, AccionesDto } from '../../application/dto/pago-no-liquidado-response.dto';
import { PagoNoLiquidadoEntity } from '../../../infrastructure/database/entities/pago-no-liquidado.entity';

@Injectable()
export class PagoNoLiquidadoService {
  constructor(
    private readonly pagoNoLiquidadoRepository: PagoNoLiquidadoRepository,
  ) {}

  /**
   * Obtiene la lista de pagos no liquidados con filtros y paginación
   */
  async findAll(query: PagoNoLiquidadoQueryDto, userId?: number): Promise<PagosNoLiquidadosListResponseDto> {
    // Obtener datos del repository
    const result = await this.pagoNoLiquidadoRepository.findWithFilters(query);

    // Transformar entidades a DTOs
    const data = await Promise.all(
      result.data.map(async (pago) => this.transformToResponseDto(pago, userId))
    );

    return {
      success: true,
      data,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Obtiene un pago no liquidado por ID
   */
  async findById(id: number, userId?: number): Promise<PagoNoLiquidadoResponseDto> {
    const pago = await this.pagoNoLiquidadoRepository.findById(id);
    
    if (!pago) {
      throw new NotFoundException(`Pago no liquidado con ID ${id} no encontrado`);
    }

    return this.transformToResponseDto(pago, userId);
  }

  /**
   * Crea un nuevo pago no liquidado
   */
  async create(pagoData: Partial<PagoNoLiquidadoEntity>, userId: number): Promise<PagoNoLiquidadoResponseDto> {
    const nuevoPago = await this.pagoNoLiquidadoRepository.create({
      ...pagoData,
      usuarioCreacion: userId,
    });

    return this.transformToResponseDto(nuevoPago, userId);
  }

  /**
   * Actualiza un pago no liquidado existente
   */
  async update(id: number, pagoData: Partial<PagoNoLiquidadoEntity>, userId: number): Promise<PagoNoLiquidadoResponseDto> {
    const pagoExistente = await this.pagoNoLiquidadoRepository.findById(id);
    
    if (!pagoExistente) {
      throw new NotFoundException(`Pago no liquidado con ID ${id} no encontrado`);
    }

    // Verificar permisos de edición
    if (!this.canEdit(pagoExistente, userId)) {
      throw new ForbiddenException('No tiene permisos para editar este pago');
    }

    const pagoActualizado = await this.pagoNoLiquidadoRepository.update(id, {
      ...pagoData,
      usuarioModificacion: userId,
    });

    return this.transformToResponseDto(pagoActualizado!, userId);
  }

  /**
   * Cancela un pago no liquidado
   */
  async cancel(id: number, userId: number): Promise<PagoNoLiquidadoResponseDto> {
    const pago = await this.pagoNoLiquidadoRepository.findById(id);
    
    if (!pago) {
      throw new NotFoundException(`Pago no liquidado con ID ${id} no encontrado`);
    }

    // Verificar permisos de cancelación
    if (!this.canCancel(pago, userId)) {
      throw new ForbiddenException('No tiene permisos para cancelar este pago');
    }

    if (pago.estado === 'Cancelado') {
      throw new ForbiddenException('El pago ya está cancelado');
    }

    const pagoCancelado = await this.pagoNoLiquidadoRepository.update(id, {
      estado: 'Cancelado',
      usuarioModificacion: userId,
    });

    return this.transformToResponseDto(pagoCancelado!, userId);
  }

  /**
   * Reversa un pago cancelado (lo reactiva)
   */
  async reverse(id: number, userId: number): Promise<PagoNoLiquidadoResponseDto> {
    const pago = await this.pagoNoLiquidadoRepository.findById(id);
    
    if (!pago) {
      throw new NotFoundException(`Pago no liquidado con ID ${id} no encontrado`);
    }

    // Verificar permisos de reversión
    if (!this.canReverse(pago, userId)) {
      throw new ForbiddenException('No tiene permisos para reversar este pago');
    }

    if (pago.estado === 'Activo') {
      throw new ForbiddenException('El pago ya está activo');
    }

    const pagoReversado = await this.pagoNoLiquidadoRepository.update(id, {
      estado: 'Activo',
      usuarioModificacion: userId,
    });

    return this.transformToResponseDto(pagoReversado!, userId);
  }

  /**
   * Obtiene estadísticas de pagos no liquidados
   */
  async getStats(): Promise<{
    totalActivos: number;
    totalCancelados: number;
    totalGeneral: number;
    montoTotal: number;
  }> {
    return this.pagoNoLiquidadoRepository.getStats();
  }

  /**
   * Transforma una entidad a DTO de respuesta
   */
  private async transformToResponseDto(pago: PagoNoLiquidadoEntity, userId?: number): Promise<PagoNoLiquidadoResponseDto> {
    // Obtener cantidad de adjuntos si no están cargados
    let cantidadAdjuntos = 0;
    if (pago.adjuntos && Array.isArray(pago.adjuntos)) {
      cantidadAdjuntos = pago.adjuntos.filter(adj => adj.estado === 'Activo').length;
    } else {
      cantidadAdjuntos = await this.pagoNoLiquidadoRepository.countAdjuntos(pago.id);
    }

    return {
      id: pago.id,
      numero_desembolso: pago.getNumeroDesembolsoCompleto(),
      responsable: pago.responsable?.nombre || 'Sin asignar',
      division: pago.division?.nombre || 'Sin división',
      estado: pago.estado,
      fecha_creacion: pago.fechaCreacion.toISOString(),
      cantidad_adjuntos: cantidadAdjuntos,
      monto: pago.monto,
      observaciones: pago.observaciones,
      acciones: this.getAcciones(pago, userId),
    };
  }

  /**
   * Determina las acciones disponibles para un usuario en un pago específico
   */
  private getAcciones(pago: PagoNoLiquidadoEntity, userId?: number): AccionesDto {
    return {
      puede_editar: this.canEdit(pago, userId),
      puede_cancelar: this.canCancel(pago, userId),
      puede_reversar: this.canReverse(pago, userId),
    };
  }

  /**
   * Verifica si un usuario puede editar un pago
   */
  private canEdit(pago: PagoNoLiquidadoEntity, userId?: number): boolean {
    if (!userId) return false;
    
    // Solo se puede editar si está activo
    if (pago.estado !== 'Activo') return false;
    
    // Por ahora, permitir a todos los usuarios autenticados
    // Aquí puedes agregar lógica más específica basada en roles
    return true;
  }

  /**
   * Verifica si un usuario puede cancelar un pago
   */
  private canCancel(pago: PagoNoLiquidadoEntity, userId?: number): boolean {
    if (!userId) return false;
    
    // Solo se puede cancelar si está activo
    if (pago.estado !== 'Activo') return false;
    
    // Por ahora, permitir a todos los usuarios autenticados
    // Aquí puedes agregar lógica más específica basada en roles
    return true;
  }

  /**
   * Verifica si un usuario puede reversar un pago
   */
  private canReverse(pago: PagoNoLiquidadoEntity, userId?: number): boolean {
    if (!userId) return false;
    
    // Solo se puede reversar si está cancelado
    if (pago.estado !== 'Cancelado') return false;
    
    // Por ahora, solo administradores pueden reversar
    // Aquí deberías verificar si el usuario tiene permisos de administrador
    return false; // Cambiar cuando implementes la verificación de roles
  }
}
