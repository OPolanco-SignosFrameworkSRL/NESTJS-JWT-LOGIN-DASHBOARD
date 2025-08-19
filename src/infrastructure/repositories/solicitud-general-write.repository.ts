import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudGeneralEntity } from '../database/entities/solicitud-general.entity';
import { CashRequestStatus } from '../../core/domain/cash-request.interface';

@Injectable()
export class SolicitudGeneralWriteRepository {
  constructor(
    @InjectRepository(SolicitudGeneralEntity)
    private readonly solicitudGeneralRepository: Repository<SolicitudGeneralEntity>,
  ) {}

  async create(solicitudData: Partial<SolicitudGeneralEntity>): Promise<SolicitudGeneralEntity> {
    const solicitud = this.solicitudGeneralRepository.create(solicitudData);
    return await this.solicitudGeneralRepository.save(solicitud);
  }

  async update(id: number, solicitudData: Partial<SolicitudGeneralEntity>): Promise<SolicitudGeneralEntity> {
    await this.solicitudGeneralRepository.update(id, solicitudData);
    const updatedSolicitud = await this.solicitudGeneralRepository.findOne({
      where: { id },
    });

    if (!updatedSolicitud) {
      throw new Error(`Solicitud con ID ${id} no encontrada`);
    }

    return updatedSolicitud;
  }

  async delete(id: number): Promise<void> {
    const solicitud = await this.solicitudGeneralRepository.findOne({
      where: { id },
    });

    if (!solicitud) {
      throw new Error(`Solicitud con ID ${id} no encontrada`);
    }

    await this.solicitudGeneralRepository.remove(solicitud);
  }

  async findById(id: number): Promise<SolicitudGeneralEntity | null> {
    return await this.solicitudGeneralRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<SolicitudGeneralEntity[]> {
    return await this.solicitudGeneralRepository.find({
      order: { fechacreada: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<SolicitudGeneralEntity[]> {
    return await this.solicitudGeneralRepository.find({
      where: { solicitada_porid: userId },
      order: { fechacreada: 'DESC' },
    });
  }

  async findByStatus(status: number): Promise<SolicitudGeneralEntity[]> {
    return await this.solicitudGeneralRepository.find({
      where: { solicitud_status: status },
      order: { fechacreada: 'DESC' },
    });
  }

  async findByDivision(divicionid: number): Promise<SolicitudGeneralEntity[]> {
    return await this.solicitudGeneralRepository.find({
      where: { divicionid },
      order: { fechacreada: 'DESC' },
    });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.solicitudGeneralRepository.count({
      where: { id },
    });
    return count > 0;
  }

  private async getNextSolicitudNumber(manager = this.solicitudGeneralRepository.manager): Promise<string> {
    const year = new Date().getFullYear();

    const last = await manager
      .getRepository(SolicitudGeneralEntity)
      .createQueryBuilder('r')
      .where('r.solicitud_numero LIKE :pattern', { pattern: `${year}-%` })
      .andWhere('r.solicitud_numero IS NOT NULL')
      .orderBy('r.solicitud_numero', 'DESC')
      .limit(1)
      .getOne();

      if (!last?.solicitud_numero) return `${year}-00001`;
      
      const lastNumber = parseInt(last.solicitud_numero.split('-')[1], 10) || 0;
      return `${year}-${(lastNumber + 1).toString().padStart(5, '0')}`;
    }
} 