import { Injectable, Inject } from '@nestjs/common';
import { IResponsableRepository } from '../repositories/responsable.repository.interface';
import { ResponsableResponseDto } from '../../application/dto/responsable-response.dto';

@Injectable()
export class ResponsableService {
  constructor(
    @Inject('IResponsableRepository')
    private readonly responsableRepository: IResponsableRepository,
  ) {}

  async findAll(): Promise<ResponsableResponseDto[]> {
    const responsables = await this.responsableRepository.findAll();
    
    return responsables.map(responsable => ({
      id: responsable.id,
      nombre: responsable.nombre,
      cedula: responsable.cedula,
      division: responsable.division,
    }));
  }

  async findById(id: number): Promise<ResponsableResponseDto> {
    const responsable = await this.responsableRepository.findById(id);
    
    if (!responsable) {
      throw new Error(`Responsable con ID ${id} no encontrado`);
    }

    return {
      id: responsable.id,
      nombre: responsable.nombre,
      cedula: responsable.cedula,
      division: responsable.division,
    };
  }
}