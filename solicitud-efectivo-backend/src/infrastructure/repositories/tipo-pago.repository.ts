import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITipoPagoRepository } from '../../core/domain/repositories/tipo-pago.repository.interface';
import { TipoPagoEntity } from '../database/entities/tipo-pago.entity';

@Injectable()
export class TipoPagoRepository implements ITipoPagoRepository {
  constructor(
    @InjectRepository(TipoPagoEntity)
    private readonly tipoPagoRepository: Repository<TipoPagoEntity>,
  ) {}

  async findAll(statusId?: number, search?: string): Promise<any[]> {
    const qb = this.tipoPagoRepository.createQueryBuilder('tp');
    if (statusId === 1) qb.andWhere('tp.estado = :estado', { estado: 1 });
    if (statusId === 2) qb.andWhere('tp.estado = :estado', { estado: 2 });
    if (search && search.trim() !== '') {
      qb.andWhere('LOWER(tp.tipo_desc) LIKE LOWER(:q)', { q: `%${search.trim()}%` });
    }
    qb.orderBy('tp.tipo_desc', 'ASC');
    return await qb.getMany();
  }

  async findAllPaginated(skip: number, take: number, statusId?: number, search?: string): Promise<[any[], number]> {
    const qb = this.tipoPagoRepository.createQueryBuilder('tp');
    if (statusId === 1) qb.andWhere('tp.estado = :estado', { estado: 1 });
    if (statusId === 2) qb.andWhere('tp.estado = :estado', { estado: 2 });
    if (search && search.trim() !== '') {
      qb.andWhere('LOWER(tp.tipo_desc) LIKE LOWER(:q)', { q: `%${search.trim()}%` });
    }
    qb.orderBy('tp.tipo_desc', 'ASC').skip(skip).take(take);
    const [rows, total] = await qb.getManyAndCount();
    return [rows, total];
  }

  async findById(id: number): Promise<any> {
    return await this.tipoPagoRepository.findOne({
      where: { pago_tipo: id }
    });
  }

  async create(data: { tipo_desc: string; estado?: number }): Promise<any> {
    // Generar pago_tipo manualmente (tabla sin IDENTITY)
    const [{ nextId }] = await this.tipoPagoRepository.query(
      'SELECT ISNULL(MAX(pago_tipo), 0) + 1 AS nextId FROM tipo_pagos'
    );
    const entity = this.tipoPagoRepository.create({
      pago_tipo: nextId,
      tipo_desc: data.tipo_desc,
      estado: data.estado ?? 1,
    });
    return await this.tipoPagoRepository.save(entity);
  }

  async update(id: number, data: { tipo_desc?: string; estado?: number }): Promise<any> {
    const existing = await this.tipoPagoRepository.findOne({ where: { pago_tipo: id } });
    if (!existing) return null;
    if (data.tipo_desc !== undefined) existing.tipo_desc = data.tipo_desc;
    if (data.estado !== undefined) existing.estado = data.estado;
    return await this.tipoPagoRepository.save(existing);
  }

  async softDelete(id: number): Promise<any> {
    const existing = await this.tipoPagoRepository.findOne({ where: { pago_tipo: id } });
    if (!existing) return null;
    existing.estado = 2; // Inactivo
    return await this.tipoPagoRepository.save(existing);
  }

  async existsByDescripcion(descripcion: string): Promise<boolean> {
    const found = await this.tipoPagoRepository
      .createQueryBuilder('tp')
      .where('LOWER(tp.tipo_desc) = LOWER(:desc)', { desc: descripcion })
      .getOne();
    return !!found;
  }
}
