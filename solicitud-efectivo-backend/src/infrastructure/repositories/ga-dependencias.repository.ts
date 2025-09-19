import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGaDependenciasRepository } from '../../core/domain/repositories/ga-dependencias.repository.interface';
import { GaDependenciasEntity } from '../database/entities/ga-dependencias.entity';
import { CreateGaDependenciasDto } from '../../core/application/dto/create-ga-dependencias.dto';
import { UpdateGaDependenciasDto } from '../../core/application/dto/update-ga-dependencias.dto';

@Injectable()
export class GaDependenciasRepository implements IGaDependenciasRepository {
  constructor(
    @InjectRepository(GaDependenciasEntity)
    private readonly gaDependenciasRepository: Repository<GaDependenciasEntity>,
  ) {}

  async findAll(): Promise<GaDependenciasEntity[]> {
    return await this.gaDependenciasRepository.find({
      order: { dependencia_nombre: 'ASC' }
    });
  }

  async findById(id: number): Promise<GaDependenciasEntity> {
    return await this.gaDependenciasRepository.findOne({
      where: { id: id }
    });
  }

  async create(createDto: CreateGaDependenciasDto): Promise<GaDependenciasEntity> {
    const dependencia = this.gaDependenciasRepository.create({
      ...createDto,
      estado: createDto.estado ?? true, // Default to true if not provided
    });
    return await this.gaDependenciasRepository.save(dependencia);
  }

  async update(id: number, updateDto: UpdateGaDependenciasDto): Promise<GaDependenciasEntity> {
    await this.gaDependenciasRepository.update(id, updateDto);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.gaDependenciasRepository.delete(id);
  }

  async findByName(name: string): Promise<GaDependenciasEntity> {
    return await this.gaDependenciasRepository.findOne({
      where: { dependencia_nombre: name }
    });
  }
}
