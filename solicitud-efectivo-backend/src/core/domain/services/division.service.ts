import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IDivisionRepository } from '../repositories/division.repository.interface';
import { CreateDivisionDto } from '../../application/dto/create-division.dto';
import { UpdateDivisionDto } from '../../application/dto/update-division.dto';
import { DivisionResponseDto } from '../../application/dto/division-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../application/dto/pagination.dto';

@Injectable()
export class DivisionService {
  constructor(
    @Inject('IDivisionRepository')
    private readonly divisionRepository: IDivisionRepository,
  ) {}

  async create(createDivisionDto: CreateDivisionDto): Promise<DivisionResponseDto> {
    // Verificar si ya existe una división con el mismo nombre
    const existingDivision = await this.divisionRepository.findByName(createDivisionDto.nombre);
    if (existingDivision.length > 0) {
      throw new BadRequestException(`Ya existe una división con el nombre: ${createDivisionDto.nombre}`);
    }

    // TODO: Validar que la dependencia existe (cuando se implemente la entidad ga_dependencias)
    // const dependencia = await this.dependenciaRepository.findById(createDivisionDto.dependencia_id);
    // if (!dependencia) {
    //   throw new BadRequestException(`Dependencia con ID ${createDivisionDto.dependencia_id} no encontrada`);
    // }

    const division = await this.divisionRepository.create(createDivisionDto);
    return this.mapToResponseDto(division);
  }

  async findAll(pagination?: PaginationDto & { estado?: 'a' | 'i' }): Promise<DivisionResponseDto[] | PaginatedResponseDto<DivisionResponseDto>> {
    let divisions: any[];
    if (pagination?.estado === 'a') {
      divisions = await this.divisionRepository.findAllByEstado(true);
    } else if (pagination?.estado === 'i') {
      divisions = await this.divisionRepository.findAllByEstado(false);
    } else {
      divisions = await this.divisionRepository.findAll();
    }
    const mappedDivisions = divisions.map(division => this.mapToResponseDto(division));

    // Si no se proporciona paginación, devolver todos los resultados
    if (!pagination || (!pagination.page && !pagination.limit)) {
      return mappedDivisions;
    }

    // Aplicar paginación
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const paginatedDivisions = mappedDivisions.slice(skip, skip + limit);
    const total = mappedDivisions.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedDivisions,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  async findById(id: number): Promise<DivisionResponseDto> {
    const division = await this.divisionRepository.findById(id);
    if (!division) {
      throw new NotFoundException(`División con ID ${id} no encontrada`);
    }
    return this.mapToResponseDto(division);
  }

  async findByDependencia(dependenciaId: number): Promise<DivisionResponseDto[]> {
    const divisions = await this.divisionRepository.findByDependencia(dependenciaId);
    return divisions.map(division => this.mapToResponseDto(division));
  }

  async update(id: number, updateDivisionDto: UpdateDivisionDto): Promise<DivisionResponseDto> {
    // Verificar que la división existe
    const existingDivision = await this.divisionRepository.findById(id);
    if (!existingDivision) {
      throw new NotFoundException(`División con ID ${id} no encontrada`);
    }

    // Si se está actualizando el nombre, verificar que no exista otra división con el mismo nombre
    if (updateDivisionDto.nombre && updateDivisionDto.nombre !== existingDivision.nombre) {
      const divisionsWithSameName = await this.divisionRepository.findByName(updateDivisionDto.nombre);
      if (divisionsWithSameName.length > 0) {
        throw new BadRequestException(`Ya existe una división con el nombre: ${updateDivisionDto.nombre}`);
      }
    }

    const division = await this.divisionRepository.update(id, updateDivisionDto);
    return this.mapToResponseDto(division);
  }

  async delete(id: number): Promise<void> {
    // Verificar que la división existe
    const existingDivision = await this.divisionRepository.findById(id);
    if (!existingDivision) {
      throw new NotFoundException(`División con ID ${id} no encontrada`);
    }

    await this.divisionRepository.delete(id);
  }

  private mapToResponseDto(division: any): DivisionResponseDto {
    return {
      id: division.id,
      nombre: division.nombre,
      dependencia_id: division.dependenciaId,
      estado: division.estado,
    };
  }
}
