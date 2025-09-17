import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDivisionRepository } from '../../core/domain/repositories/division.repository.interface';
import { DivisionEntity } from '../database/entities/division.entity';
import { CreateDivisionDto } from '../../core/application/dto/create-division.dto';
import { UpdateDivisionDto } from '../../core/application/dto/update-division.dto';

@Injectable()
export class DivisionRepository implements IDivisionRepository {
  constructor(
    @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
  ) {}

  async create(createDivisionDto: CreateDivisionDto): Promise<any> {
    const division = this.divisionRepository.create({
      nombre: createDivisionDto.nombre,
      dependenciaId: createDivisionDto.dependencia_id,
      estado: createDivisionDto.estado ?? true, // Default a true si no se especifica
    });
    return await this.divisionRepository.save(division);
  }

  async findAll(): Promise<any[]> {
    return await this.divisionRepository.find({
      order: { nombre: 'ASC' }
    });
  }

  async findAllByEstado(estadoActivo: boolean): Promise<any[]> {
    return await this.divisionRepository.find({
      where: { estado: estadoActivo as any },
      order: { nombre: 'ASC' }
    });
  }

  async findById(id: number): Promise<any> {
    return await this.divisionRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateDivisionDto: UpdateDivisionDto): Promise<any> {
    const updateData: any = {};
    
    if (updateDivisionDto.nombre !== undefined) {
      updateData.nombre = updateDivisionDto.nombre;
    }
    if (updateDivisionDto.dependencia_id !== undefined) {
      updateData.dependenciaId = updateDivisionDto.dependencia_id;
    }
    if (updateDivisionDto.estado !== undefined) {
      updateData.estado = updateDivisionDto.estado;
    }

    await this.divisionRepository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.divisionRepository.delete(id);
  }

  async findByName(nombre: string): Promise<any[]> {
    return await this.divisionRepository.find({
      where: { nombre },
      order: { nombre: 'ASC' }
    });
  }

  async findByDependencia(dependenciaId: number): Promise<any[]> {
    return await this.divisionRepository.find({
      where: { dependenciaId },
      order: { nombre: 'ASC' }
    });
  }
}
