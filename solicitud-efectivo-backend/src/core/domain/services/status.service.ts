import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusRepository } from '../../../infrastructure/repositories/status.repository';
import { StatusEntity } from '../../../infrastructure/database/entities/status.entity';

@Injectable()
export class StatusService {
  constructor(private readonly statusRepository: StatusRepository) {}

  async getAllStatus(): Promise<StatusEntity[]> {
    return this.statusRepository.findAll();
  }

  async getStatusById(id: number): Promise<StatusEntity> {
    const status = await this.statusRepository.findById(id);
    if (!status) {
      throw new NotFoundException(`Status con ID ${id} no encontrado`);
    }
    return status;
  }

  async getActiveStatus(): Promise<StatusEntity[]> {
    return this.statusRepository.findActive();
  }

  async getInactiveStatus(): Promise<StatusEntity[]> {
    return this.statusRepository.findInactive();
  }
}
