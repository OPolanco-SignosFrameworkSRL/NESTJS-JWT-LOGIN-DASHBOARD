import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISolicitudDesembolsoWebTiposRepository } from '../repositories/solicitud-desembolso-web-tipos.repository.interface';
import { SolicitudDesembolsoWebTiposResponseDto } from '../../application/dto/solicitud-desembolso-web-tipos-response.dto';

@Injectable()
export class SolicitudDesembolsoWebTiposService {
  constructor(
    @Inject('ISolicitudDesembolsoWebTiposRepository')
    private readonly solicitudDesembolsoWebTiposRepository: ISolicitudDesembolsoWebTiposRepository,
  ) {}

  async findAll(): Promise<SolicitudDesembolsoWebTiposResponseDto[]> {
    const tipos = await this.solicitudDesembolsoWebTiposRepository.findAll();
    return tipos.map(tipo => this.mapToResponseDto(tipo));
  }

  async findById(id: number): Promise<SolicitudDesembolsoWebTiposResponseDto> {
    const tipo = await this.solicitudDesembolsoWebTiposRepository.findById(id);
    if (!tipo) {
      throw new NotFoundException(`Tipo de solicitud desembolso web con ID ${id} no encontrado`);
    }
    return this.mapToResponseDto(tipo);
  }

  private mapToResponseDto(tipo: any): SolicitudDesembolsoWebTiposResponseDto {
    return {
      id: tipo.id,
      tipo_desc: tipo.tipo_desc,
      tipo_icon: tipo.tipo_icon,
      produccion_flag: tipo.produccion_flag,
    };
  }
}
