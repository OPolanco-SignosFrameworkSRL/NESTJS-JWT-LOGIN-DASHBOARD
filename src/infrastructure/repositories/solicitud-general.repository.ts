import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudGeneralEntity } from '../database/entities/solicitud-general.entity';
import { ISolicitudGeneralRepository } from '../../core/domain/repositories/solicitud-general.repository.interface';
import { SolicitudGeneral } from '../../core/domain/entities/solicitud-general.entity';
import { ISolicitudGeneralFilters, ISolicitudGeneralStats } from '../../core/domain/solicitud-general.interface';

@Injectable()
export class SolicitudGeneralRepository implements ISolicitudGeneralRepository {
  constructor(
    @InjectRepository(SolicitudGeneralEntity)
    private readonly solicitudGeneralRepository: Repository<SolicitudGeneralEntity>,
  ) {}

  async findAll(): Promise<SolicitudGeneral[]> {
    const solicitudes = await this.solicitudGeneralRepository.find({
      where: {},
      order: { fechacreada: 'DESC' }
    });
    
    // Simular el nombre del usuario por ahora
    return solicitudes.map(solicitud => {
      const data = {
        ...solicitud,
        usuarionombre: `Usuario ${solicitud.solicitada_porid}` // Placeholder
      };
      return SolicitudGeneral.fromDatabase(data);
    });
  }

  async findById(id: number): Promise<SolicitudGeneral | null> {
    const solicitud = await this.solicitudGeneralRepository.findOne({
      where: { id }
    });
    
    if (!solicitud) return null;
    
    const data = {
      ...solicitud,
      usuarionombre: `Usuario ${solicitud.solicitada_porid}` // Placeholder
    };
    return SolicitudGeneral.fromDatabase(data);
  }

  async findByUser(userId: number): Promise<SolicitudGeneral[]> {
    const solicitudes = await this.solicitudGeneralRepository.find({
      where: { solicitada_porid: userId },
      order: { fechacreada: 'DESC' }
    });
    
    return solicitudes.map(solicitud => {
      const data = {
        ...solicitud,
        usuarionombre: `Usuario ${solicitud.solicitada_porid}` // Placeholder
      };
      return SolicitudGeneral.fromDatabase(data);
    });
  }

  async findByStatus(status: number): Promise<SolicitudGeneral[]> {
    const solicitudes = await this.solicitudGeneralRepository.find({
      where: { solicitud_status: status },
      order: { fechacreada: 'DESC' }
    });
    
    return solicitudes.map(solicitud => {
      const data = {
        ...solicitud,
        usuarionombre: `Usuario ${solicitud.solicitada_porid}` // Placeholder
      };
      return SolicitudGeneral.fromDatabase(data);
    });
  }

  async findByDepartamento(departamento: string): Promise<SolicitudGeneral[]> {
    const solicitudes = await this.solicitudGeneralRepository.find({
      where: { departamento },
      order: { fechacreada: 'DESC' }
    });
    
    return solicitudes.map(solicitud => {
      const data = {
        ...solicitud,
        usuarionombre: `Usuario ${solicitud.solicitada_porid}` // Placeholder
      };
      return SolicitudGeneral.fromDatabase(data);
    });
  }

  async findByFilters(filters: ISolicitudGeneralFilters): Promise<SolicitudGeneral[]> {
    const queryBuilder = this.solicitudGeneralRepository.createQueryBuilder('solicitud');

    // Siempre filtrar por registros válidos
    queryBuilder.where('solicitud.valid = :valid', { valid: '1' });

    if (filters.solicitada_porid) {
      queryBuilder.andWhere('solicitud.solicitada_porid = :solicitada_porid', { 
        solicitada_porid: filters.solicitada_porid 
      });
    }

    if (filters.solicitud_tipo) {
      queryBuilder.andWhere('solicitud.solicitud_tipo = :solicitud_tipo', { 
        solicitud_tipo: filters.solicitud_tipo 
      });
    }

    if (filters.solicitud_status) {
      queryBuilder.andWhere('solicitud.solicitud_status = :solicitud_status', { 
        solicitud_status: filters.solicitud_status 
      });
    }

    if (filters.departamento) {
      queryBuilder.andWhere('solicitud.departamento LIKE :departamento', { 
        departamento: `%${filters.departamento}%` 
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('solicitud.fechacreada >= :startDate', { 
        startDate: filters.startDate 
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('solicitud.fechacreada <= :endDate', { 
        endDate: filters.endDate 
      });
    }

    if (filters.minAmount) {
      queryBuilder.andWhere('solicitud.monto_solicitado >= :minAmount', { 
        minAmount: filters.minAmount 
      });
    }

    if (filters.maxAmount) {
      queryBuilder.andWhere('solicitud.monto_solicitado <= :maxAmount', { 
        maxAmount: filters.maxAmount 
      });
    }

    // Nota: usuarionombre se simula en el mapeo
    queryBuilder.orderBy('solicitud.fechacreada', 'DESC');

    const solicitudes = await queryBuilder.getMany();
    
    return solicitudes.map(solicitud => {
      const data = {
        ...solicitud,
        usuarionombre: `Usuario ${solicitud.solicitada_porid}` // Placeholder
      };
      return SolicitudGeneral.fromDatabase(data);
    });
  }

  async getStats(): Promise<ISolicitudGeneralStats> {
    const totalSolicitudes = await this.solicitudGeneralRepository.count({
      where: {}
    });

    const solicitudesPorStatus = await this.solicitudGeneralRepository
      .createQueryBuilder('solicitud')
      .select('solicitud.solicitud_status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('solicitud.valid = :valid', { valid: '1' })
      .groupBy('solicitud.solicitud_status')
      .getRawMany();

    const solicitudesPorDepartamento = await this.solicitudGeneralRepository
      .createQueryBuilder('solicitud')
      .select('solicitud.departamento', 'departamento')
      .addSelect('COUNT(*)', 'count')
      .where('solicitud.valid = :valid', { valid: '1' })
      .groupBy('solicitud.departamento')
      .getRawMany();

    const montoTotalResult = await this.solicitudGeneralRepository
      .createQueryBuilder('solicitud')
      .select('SUM(solicitud.monto_solicitado)', 'total')
      .where('solicitud.valid = :valid', { valid: '1' })
      .getRawOne();

    return {
      totalSolicitudes,
      solicitudesPorStatus,
      solicitudesPorDepartamento,
      montoTotal: Number(montoTotalResult?.total || 0)
    };
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.solicitudGeneralRepository.count({
      where: { id }
    });
    return count > 0;
  }
} 
