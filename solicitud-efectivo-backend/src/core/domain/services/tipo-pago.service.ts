import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITipoPagoRepository } from '../repositories/tipo-pago.repository.interface';
import { TipoPagoResponseDto } from '../../application/dto/tipo-pago-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';
import { TipoPagoFiltersDto } from '../../application/dto/tipo-pago-filters.dto';
import { UpdateTipoPagoDto } from '../../application/dto/update-tipo-pago.dto';

@Injectable()
export class TipoPagoService {
  constructor(
    @Inject('ITipoPagoRepository')
    private readonly tipoPagoRepository: ITipoPagoRepository,
  ) {}

  async findAll(pagination?: PaginationDto & TipoPagoFiltersDto): Promise<TipoPagoResponseDto[] | PaginatedResponseDto<TipoPagoResponseDto>> {
    const statusIdRaw = (pagination as any)?.statusId;
    const statusId = statusIdRaw !== undefined ? parseInt(String(statusIdRaw), 10) : undefined;
    const search = (pagination as any)?.search as string | undefined;

    if (!pagination || (!pagination.page && !pagination.limit)) {
      const tiposPago = await this.tipoPagoRepository.findAll(statusId, search);
      return tiposPago.map(tipoPago => this.mapToResponseDto(tipoPago));
    }

    const rawPage = (pagination as any).page;
    const rawLimit = (pagination as any).limit;
    let page = parseInt(String(rawPage), 10);
    let limit = parseInt(String(rawLimit), 10);
    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    // statusId y search ya calculados arriba

    const [rows, total] = await this.tipoPagoRepository.findAllPaginated(skip, limit, statusId, search);
    const data = rows.map(r => this.mapToResponseDto(r));
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { data, total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  async findById(id: number): Promise<TipoPagoResponseDto> {
    const tipoPago = await this.tipoPagoRepository.findById(id);
    if (!tipoPago) {
      throw new NotFoundException(`Tipo de pago con ID ${id} no encontrado`);
    }
    return this.mapToResponseDto(tipoPago);
  }

  async create(data: { tipo_desc: string; estado?: number }): Promise<TipoPagoResponseDto> {
    const exists = await this.tipoPagoRepository.existsByDescripcion(data.tipo_desc);
    if (exists) {
      throw new NotFoundException('Ya existe un tipo de pago con esa descripción');
    }
    const created = await this.tipoPagoRepository.create(data);
    return this.mapToResponseDto(created);
  }

  async update(id: number, dto: UpdateTipoPagoDto): Promise<TipoPagoResponseDto> {
    const current = await this.tipoPagoRepository.findById(id);
    if (!current) throw new NotFoundException(`Tipo de pago con ID ${id} no encontrado`);
    const updated = await this.tipoPagoRepository.update(id, dto as any);
    return this.mapToResponseDto(updated);
  }

  async softDelete(id: number): Promise<TipoPagoResponseDto> {
    const current = await this.tipoPagoRepository.findById(id);
    if (!current) throw new NotFoundException(`Tipo de pago con ID ${id} no encontrado`);
    const updated = await this.tipoPagoRepository.softDelete(id);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(tipoPago: any): TipoPagoResponseDto {
    return {
      pago_tipo: Number(tipoPago.pago_tipo),
      tipo_desc: tipoPago.tipo_desc,
      estado: tipoPago.estado ?? 1,
    };
  }
}
