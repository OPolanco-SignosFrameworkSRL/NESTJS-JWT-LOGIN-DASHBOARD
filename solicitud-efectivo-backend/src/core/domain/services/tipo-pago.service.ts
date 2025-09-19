import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITipoPagoRepository } from '../repositories/tipo-pago.repository.interface';
import { TipoPagoResponseDto } from '../../application/dto/tipo-pago-response.dto';

@Injectable()
export class TipoPagoService {
  constructor(
    @Inject('ITipoPagoRepository')
    private readonly tipoPagoRepository: ITipoPagoRepository,
  ) {}

  async findAll(): Promise<TipoPagoResponseDto[]> {
    const tiposPago = await this.tipoPagoRepository.findAll();
    return tiposPago.map(tipoPago => this.mapToResponseDto(tipoPago));
  }

  async findById(id: number): Promise<TipoPagoResponseDto> {
    const tipoPago = await this.tipoPagoRepository.findById(id);
    if (!tipoPago) {
      throw new NotFoundException(`Tipo de pago con ID ${id} no encontrado`);
    }
    return this.mapToResponseDto(tipoPago);
  }

  private mapToResponseDto(tipoPago: any): TipoPagoResponseDto {
    return {
      pago_tipo: tipoPago.pago_tipo,
      tipo_desc: tipoPago.tipo_desc,
    };
  }
}
