import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IGaDependenciasRepository } from '../repositories/ga-dependencias.repository.interface';
import { CreateGaDependenciasDto } from '../../application/dto/create-ga-dependencias.dto';
import { UpdateGaDependenciasDto } from '../../application/dto/update-ga-dependencias.dto';
import { GaDependenciasResponseDto } from '../../application/dto/ga-dependencias-response.dto';

@Injectable()
export class GaDependenciasService {
  constructor(
    @Inject('IGaDependenciasRepository')
    private readonly gaDependenciasRepository: IGaDependenciasRepository,
  ) {}

  async findAll(): Promise<GaDependenciasResponseDto[]> {
    const dependencias = await this.gaDependenciasRepository.findAll();
    return dependencias.map(dependencia => this.mapToResponseDto(dependencia));
  }

  async findById(id: number): Promise<GaDependenciasResponseDto> {
    const dependencia = await this.gaDependenciasRepository.findById(id);
    if (!dependencia) {
      throw new NotFoundException(`Dependencia con ID ${id} no encontrada`);
    }
    return this.mapToResponseDto(dependencia);
  }

  async create(createDto: CreateGaDependenciasDto): Promise<GaDependenciasResponseDto> {
    // Check if name already exists
    const existingDependencia = await this.gaDependenciasRepository.findByName(createDto.dependencia_nombre);
    if (existingDependencia) {
      throw new ConflictException(`Ya existe una dependencia con el nombre: ${createDto.dependencia_nombre}`);
    }

    const dependencia = await this.gaDependenciasRepository.create(createDto);
    return this.mapToResponseDto(dependencia);
  }

  async update(id: number, updateDto: UpdateGaDependenciasDto): Promise<GaDependenciasResponseDto> {
    const existingDependencia = await this.gaDependenciasRepository.findById(id);
    if (!existingDependencia) {
      throw new NotFoundException(`Dependencia con ID ${id} no encontrada`);
    }

    // Check if new name already exists (if name is being updated)
    if (updateDto.dependencia_nombre && updateDto.dependencia_nombre !== existingDependencia.dependencia_nombre) {
      const nameExists = await this.gaDependenciasRepository.findByName(updateDto.dependencia_nombre);
      if (nameExists) {
        throw new ConflictException(`Ya existe una dependencia con el nombre: ${updateDto.dependencia_nombre}`);
      }
    }

    const dependencia = await this.gaDependenciasRepository.update(id, updateDto);
    return this.mapToResponseDto(dependencia);
  }

  async delete(id: number): Promise<void> {
    const existingDependencia = await this.gaDependenciasRepository.findById(id);
    if (!existingDependencia) {
      throw new NotFoundException(`Dependencia con ID ${id} no encontrada`);
    }

    await this.gaDependenciasRepository.delete(id);
  }

  private mapToResponseDto(dependencia: any): GaDependenciasResponseDto {
    return {
      id: dependencia.id,
      dependencia_nombre: dependencia.dependencia_nombre,
      estado: dependencia.estado,
    };
  }
}
