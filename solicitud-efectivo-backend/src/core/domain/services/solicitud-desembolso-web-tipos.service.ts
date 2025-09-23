import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ISolicitudDesembolsoWebTiposRepository } from '../repositories/solicitud-desembolso-web-tipos.repository.interface';
import { SolicitudDesembolsoWebTiposResponseDto } from '../../application/dto/solicitud-desembolso-web-tipos-response.dto';
import { TipoSolicitudFiltersDto } from '../../application/dto/tipo-solicitud-filters.dto';
import { CreateTipoSolicitudDto } from '../../application/dto/create-tipo-solicitud.dto';
import { UpdateTipoSolicitudDto } from '../../application/dto/update-tipo-solicitud.dto';
import { DataSource } from 'typeorm';
import { SolicitudDesembolsoWebTiposEntity } from '../../../infrastructure/database/entities/solicitud-desembolso-web-tipos.entity';

@Injectable()
export class SolicitudDesembolsoWebTiposService {
  constructor(
    @Inject('ISolicitudDesembolsoWebTiposRepository')
    private readonly solicitudDesembolsoWebTiposRepository: ISolicitudDesembolsoWebTiposRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters?: TipoSolicitudFiltersDto): Promise<{ data: SolicitudDesembolsoWebTiposResponseDto[]; total: number; page: number; limit: number; totalPages: number; }>{
    const repo = this.dataSource.getRepository(SolicitudDesembolsoWebTiposEntity);
    const qb = repo.createQueryBuilder('t');

    if (filters?.search) {
      qb.andWhere('t.tipo_desc LIKE :q', { q: `%${filters.search}%` });
    }
    // Filtros por estado removidos (no existe columna 'estado')

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    qb.orderBy('t.tipo_desc', 'ASC').skip((page - 1) * limit).take(limit);

    const [rows, total] = await qb.getManyAndCount();
    const data = rows.map(r => this.mapToResponseDto(r));
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { data, total, page, limit, totalPages };
  }

  async findById(id: number): Promise<SolicitudDesembolsoWebTiposResponseDto> {
    const tipo = await this.solicitudDesembolsoWebTiposRepository.findById(id);
    if (!tipo) {
      throw new NotFoundException(`Tipo de solicitud desembolso web con ID ${id} no encontrado`);
    }
    return this.mapToResponseDto(tipo);
  }

  async create(dto: CreateTipoSolicitudDto): Promise<SolicitudDesembolsoWebTiposResponseDto> {
    // Obtener nextId manualmente porque la columna 'id' en BD no es IDENTITY
    const [{ nextId }] = await this.dataSource.query(
      "SELECT ISNULL(MAX(id), 0) + 1 AS nextId FROM solicitud_desembolso_web_tipos"
    );

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(SolicitudDesembolsoWebTiposEntity)
      .values({
        id: nextId,
        tipo_desc: dto.tipoDesc,
        tipo_icon: dto.tipoIcon ?? '',
        produccion_flag: dto.produccionFlag ? 1 : 0,
      })
      .execute();
    return this.findById(nextId);
  }

  async update(id: number, dto: UpdateTipoSolicitudDto): Promise<SolicitudDesembolsoWebTiposResponseDto> {
    const existing = await this.findById(id);
    await this.dataSource
      .createQueryBuilder()
      .update(SolicitudDesembolsoWebTiposEntity)
      .set({
        tipo_desc: dto.tipoDesc ?? existing.tipo_desc,
        tipo_icon: dto.tipoIcon ?? existing.tipo_icon,
        produccion_flag: dto.produccionFlag === undefined ? existing.produccion_flag : (dto.produccionFlag ? 1 : 0),
      })
      .where('id = :id', { id })
      .execute();
    return this.findById(id);
  }

  async remove(id: number): Promise<{ message: string }>{
    // Validar dependencias en solicitud_efectivo
    const [dep] = await this.dataSource.query(
      'SELECT COUNT(1) AS cnt FROM solicitud_efectivo WHERE tipo_solicitud_id = @0',
      [id],
    );
    if (dep?.cnt > 0) {
      throw new BadRequestException('La Solicitud [Tipo de Solicitud] tiene registros vinculados, no puede ser eliminado');
    }
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(SolicitudDesembolsoWebTiposEntity)
      .where('id = :id', { id })
      .execute();
    return { message: 'Eliminado correctamente' };
  }

  private mapToResponseDto(tipo: any): SolicitudDesembolsoWebTiposResponseDto {
    return {
      id: tipo.id,
      tipo_desc: tipo.tipo_desc,
      tipo_icon: tipo.tipo_icon,
      produccion_flag: tipo.produccion_flag,
    };
  }
}
