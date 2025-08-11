import { Injectable, Inject } from '@nestjs/common';
import { IDesembolsoService } from './desembolso.service.interface';
import { IDesembolsoRepository } from '../repositories/desembolso.repository.interface';
import { CreateDesembolsoDto } from '../../application/dto/create-desembolso.dto';

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

  async findAll(): Promise<any[]> {
    return await this.desembolsoRepository.findAll();
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
