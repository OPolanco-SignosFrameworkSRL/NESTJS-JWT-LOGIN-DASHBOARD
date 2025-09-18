import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from '../database/entities/status.entity';

@Injectable()
export class StatusRepository {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
  ) {}

  async findAll(): Promise<StatusEntity[]> {
    return this.statusRepository.find({
      order: { id: 'ASC' }
    });
  }

  async findById(id: number): Promise<StatusEntity | null> {
    return this.statusRepository.findOne({ where: { id } });
  }

  async findActive(): Promise<StatusEntity[]> {
    return this.statusRepository.find({
      where: { charStatus: 'A' },
      order: { id: 'ASC' }
    });
  }

  async findInactive(): Promise<StatusEntity[]> {
    return this.statusRepository.find({
      where: { charStatus: 'I' },
      order: { id: 'ASC' }
    });
  }
}
