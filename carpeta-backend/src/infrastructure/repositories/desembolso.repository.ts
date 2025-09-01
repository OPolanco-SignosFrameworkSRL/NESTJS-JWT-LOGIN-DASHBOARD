import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDesembolsoRepository } from '../../core/domain/repositories/desembolso.repository.interface';
import { DesembolsoEntity } from '../database/entities/desembolso.entity';
import { CreateDesembolsoDto } from '../../core/application/dto/create-desembolso.dto';

@Injectable()
export class DesembolsoRepository implements IDesembolsoRepository {
  constructor(
    @InjectRepository(DesembolsoEntity)
    private readonly desembolsoRepository: Repository<DesembolsoEntity>,
  ) {}

  async create(createDesembolsoDto: CreateDesembolsoDto & { numero_desembolso: string; registrado_por_id: number; estado: string }): Promise<any> {
    const desembolso = this.desembolsoRepository.create(createDesembolsoDto);
    return await this.desembolsoRepository.save(desembolso);
  }

  async findAll(): Promise<any[]> {
    return await this.desembolsoRepository.find({
      order: { fecha_registro: 'DESC' }
    });
  }

  async findById(id: number): Promise<any> {
    return await this.desembolsoRepository.findOne({ where: { id } });
  }

  async findBySolicitud(solicitudId: number): Promise<any[]> {
    return await this.desembolsoRepository.find({
      where: { solicitud_id: solicitudId },
      order: { fecha_registro: 'DESC' }
    });
  }

  async findByResponsable(responsableId: number): Promise<any[]> {
    return await this.desembolsoRepository.find({
      where: { responsable_id: responsableId },
      order: { fecha_registro: 'DESC' }
    });
  }

  async findLastByMonth(year: number, month: string): Promise<any> {
    const startDate = new Date(year, parseInt(month) - 1, 1);
    const endDate = new Date(year, parseInt(month), 0, 23, 59, 59);

    return await this.desembolsoRepository
      .createQueryBuilder('desembolso')
      .where('desembolso.fecha_registro >= :startDate', { startDate })
      .andWhere('desembolso.fecha_registro <= :endDate', { endDate })
      .orderBy('desembolso.numero_desembolso', 'DESC')
      .getOne();
  }

  async update(id: number, updateData: any): Promise<any> {
    await this.desembolsoRepository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.desembolsoRepository.delete(id);
  }

  async findAllWithPagination(filters?: any & { skip?: number; take?: number }): Promise<[any[], number]> {
    const query = this.desembolsoRepository.createQueryBuilder('desembolso');

    // Aplicar filtros si existen
    if (filters?.estado) {
      query.andWhere('desembolso.estado = :estado', { estado: filters.estado });
    }
    if (filters?.startDate) {
      query.andWhere('desembolso.fecha_registro >= :startDate', { startDate: filters.startDate });
    }
    if (filters?.endDate) {
      query.andWhere('desembolso.fecha_registro <= :endDate', { endDate: filters.endDate });
    }

    // Aplicar paginación
    if (filters?.skip !== undefined) {
      query.skip(filters.skip);
    }
    if (filters?.take !== undefined) {
      query.take(filters.take);
    }

    return await query.getManyAndCount();
  }
}
