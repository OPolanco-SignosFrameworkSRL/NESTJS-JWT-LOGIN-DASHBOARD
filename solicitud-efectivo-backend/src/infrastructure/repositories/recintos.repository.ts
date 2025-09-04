import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRecintosRepository } from '../../core/domain/repositories/recintos.repository.interface';
import { RecintosEntity } from '../database/entities/recintos.entity';
import { CreateRecintosDto } from '../../core/application/dto/create-recintos.dto';
import { UpdateRecintosDto } from '../../core/application/dto/update-recintos.dto';

@Injectable()
export class RecintosRepository implements IRecintosRepository {
  constructor(
    @InjectRepository(RecintosEntity)
    private readonly recintosRepository: Repository<RecintosEntity>,
  ) {}

  async findAll(): Promise<RecintosEntity[]> {
    return await this.recintosRepository.find({
      order: { recinto: 'ASC' }
    });
  }

  async findById(id: number): Promise<RecintosEntity> {
    return await this.recintosRepository.findOne({
      where: { id: id }
    });
  }

  async create(createDto: CreateRecintosDto): Promise<RecintosEntity> {
    const recinto = this.recintosRepository.create({
      ...createDto,
      estado: createDto.estado ?? true, // Default to true if not provided
    });
    return await this.recintosRepository.save(recinto);
  }

  async update(id: number, updateDto: UpdateRecintosDto): Promise<RecintosEntity> {
    await this.recintosRepository.update(id, updateDto);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.recintosRepository.delete(id);
  }

  async findByName(name: string): Promise<RecintosEntity> {
    return await this.recintosRepository.findOne({
      where: { recinto: name }
    });
  }
}
