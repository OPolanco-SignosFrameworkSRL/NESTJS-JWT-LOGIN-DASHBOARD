import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IRecintosRepository } from '../repositories/recintos.repository.interface';
import { CreateRecintosDto } from '../../application/dto/create-recintos.dto';
import { UpdateRecintosDto } from '../../application/dto/update-recintos.dto';
import { RecintosResponseDto, RecintosListResponseDto } from '../../application/dto/recintos-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class RecintosService {
  constructor(
    @Inject('IRecintosRepository')
    private readonly recintosRepository: IRecintosRepository,
  ) {}

  async findAll(pagination?: PaginationDto): Promise<RecintosListResponseDto> {
    const recintos = await this.recintosRepository.findAll();
    const mappedRecintos = recintos.map(recinto => this.mapToResponseDto(recinto));

    // Aplicar paginación si se proporciona
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;
    const paginatedRecintos = mappedRecintos.slice(skip, skip + limit);
    const total = mappedRecintos.length;
    const totalPages = Math.ceil(total / limit);

    // Devolver siempre la estructura completa que espera el frontend
    return {
      data: paginatedRecintos,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      statusCode: 200,
      message: 'Lista de recintos obtenida exitosamente',
      timestamp: new Date().toISOString(),
    };
  }

  async findById(id: number): Promise<RecintosResponseDto> {
    const recinto = await this.recintosRepository.findById(id);
    if (!recinto) {
      throw new NotFoundException(`Recinto con ID ${id} no encontrado`);
    }
    return this.mapToResponseDto(recinto);
  }

  async create(createDto: CreateRecintosDto): Promise<RecintosResponseDto> {
    // Check if name already exists
    const existingRecinto = await this.recintosRepository.findByName(createDto.recinto);
    if (existingRecinto) {
      throw new ConflictException(`Ya existe un recinto con el nombre: ${createDto.recinto}`);
    }

    const recinto = await this.recintosRepository.create(createDto);
    return this.mapToResponseDto(recinto);
  }

  async update(id: number, updateDto: UpdateRecintosDto): Promise<RecintosResponseDto> {
    const existingRecinto = await this.recintosRepository.findById(id);
    if (!existingRecinto) {
      throw new NotFoundException(`Recinto con ID ${id} no encontrado`);
    }

    // Check if new name already exists (if name is being updated)
    if (updateDto.recinto && updateDto.recinto !== existingRecinto.recinto) {
      const nameExists = await this.recintosRepository.findByName(updateDto.recinto);
      if (nameExists) {
        throw new ConflictException(`Ya existe un recinto con el nombre: ${updateDto.recinto}`);
      }
    }

    const recinto = await this.recintosRepository.update(id, updateDto);
    return this.mapToResponseDto(recinto);
  }

  async delete(id: number): Promise<void> {
    const existingRecinto = await this.recintosRepository.findById(id);
    if (!existingRecinto) {
      throw new NotFoundException(`Recinto con ID ${id} no encontrado`);
    }

    await this.recintosRepository.delete(id);
  }

  private mapToResponseDto(recinto: any): RecintosResponseDto {
    return {
      id: recinto.id,
      recinto: recinto.recinto,
      ubicacion: recinto.ubicacion,
      statusId: recinto.estado, // Mapear estado a statusId
      valido: recinto.estado === 1, // Convertir estado numérico a boolean para valido
    };
  }
}
