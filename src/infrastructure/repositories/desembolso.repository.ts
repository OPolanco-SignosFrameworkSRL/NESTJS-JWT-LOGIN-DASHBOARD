import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDesembolsoRepository } from '../../core/domain/repositories/desembolso.repository.interface';
import { DesembolsoEntity } from '../database/entities/desembolso.entity';
import { SolicitudEfectivoEntity } from '../database/entities/solicitud-efectivo.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateDesembolsoDto } from '../../core/application/dto/create-desembolso.dto';

@Injectable()
export class DesembolsoRepository implements IDesembolsoRepository {
  constructor(
    @InjectRepository(DesembolsoEntity)
    private readonly desembolsoRepository: Repository<DesembolsoEntity>,
    @InjectRepository(SolicitudEfectivoEntity)
    private readonly solicitudEfectivoRepository: Repository<SolicitudEfectivoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createDesembolsoDto: CreateDesembolsoDto & { numDesembolso: string }): Promise<any> {
    const desembolso = this.desembolsoRepository.create({
      solicitudId: createDesembolsoDto.solicitud_id,
      responsableId: createDesembolsoDto.responsable_id,
      montoDesembolso: createDesembolsoDto.monto_desembolso,
      chequeNum: createDesembolsoDto.cheque_num,
      referencia: createDesembolsoDto.referencia,
      observacion: createDesembolsoDto.observacion,
      numDesembolso: createDesembolsoDto.numDesembolso,
    });

    return await this.desembolsoRepository.save(desembolso);
  }

  async findLastByMonth(year: number, month: string): Promise<any> {
    // Como no tienes fecha_registro, usaremos el ID como aproximación
    return await this.desembolsoRepository
      .createQueryBuilder('desembolso')
      .where('desembolso.numDesembolso LIKE :pattern', { 
        pattern: `DES-${year}${month}-%` 
      })
      .orderBy('desembolso.id', 'DESC')
      .limit(1)
      .getOne();
  }

  async findAll(): Promise<any[]> {
    return await this.desembolsoRepository.find({
      order: { id: 'DESC' }
    });
  }

  async findById(id: number): Promise<any> {
    return await this.desembolsoRepository.findOne({ where: { id } });
  }

  async findBySolicitud(solicitudId: number): Promise<any[]> {
    return await this.desembolsoRepository.find({
      where: { solicitudId },
      order: { id: 'DESC' }
    });
  }

  async findByResponsable(responsableId: number): Promise<any[]> {
    return await this.desembolsoRepository.find({
      where: { responsableId },
      order: { id: 'DESC' }
    });
  }

  async update(id: number, updateData: any): Promise<any> {
    await this.desembolsoRepository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.desembolsoRepository.delete(id);
  }

  // Nuevo método para obtener datos de solicitud con información relacionada
  async getSolicitudData(solicitudId: number): Promise<any> {
    const query = this.desembolsoRepository
      .createQueryBuilder('desembolso')
      .select([
        'desembolso.id',
        'desembolso.solicitudId',
        'desembolso.montoDesembolso',
        'desembolso.chequeNum',
        'desembolso.referencia',
        'desembolso.observacion'
      ])
      .addSelect([
        'solicitud.id',
        'solicitud.tipoSolicitudId',
        'solicitud.monto',
        'solicitud.concepto'
      ])
      .addSelect([
        'usuario.id',
        'usuario.nombre',
        'usuario.apellido'
      ])
      .leftJoin('solicitud_efectivo', 'solicitud', 'solicitud.id = desembolso.solicitudId')
      .leftJoin('users', 'usuario', 'usuario.id = solicitud.usuarioId')
      .where('desembolso.solicitudId = :solicitudId', { solicitudId });

    return await query.getOne();
  }

  // Nuevo método para obtener datos de responsable desde ga_colaboradores
  async getResponsableData(responsableId: number): Promise<any> {
    const query = this.desembolsoRepository
      .createQueryBuilder('desembolso')
      .select([
        'desembolso.id',
        'desembolso.responsableId'
      ])
      .addSelect([
        'colaborador.id',
        'colaborador.nombre',
        'colaborador.cedula',
        'colaborador.division'
      ])
      .leftJoin('ga_colaboradores', 'colaborador', 'colaborador.id = desembolso.responsableId')
      .where('desembolso.responsableId = :responsableId', { responsableId });

    return await query.getOne();
  }

  // Método alternativo usando consulta SQL directa para ga_colaboradores
  async getResponsableDataRaw(responsableId: number): Promise<any> {
    const result = await this.desembolsoRepository.query(`
      SELECT 
        d.id as desembolso_id,
        d.responsable_id,
        gc.nombre,
        gc.cedula,
        gc.division
      FROM desembolso d
      LEFT JOIN ga_colaboradores gc ON d.responsable_id = gc.id
      WHERE d.responsable_id = ?
    `, [responsableId]);

    return result[0] || null;
  }

  async findAllWithPagination(filters?: any & { skip?: number; take?: number }): Promise<[any[], number]> {
    const query = this.desembolsoRepository.createQueryBuilder('desembolso');

    // Aplicar paginación
    if (filters?.skip !== undefined) {
      query.skip(filters.skip);
    }
    if (filters?.take !== undefined) {
      query.take(filters.take);
    }

    return await query.getManyAndCount();
  }

  async findSolicitudById(solicitudId: number): Promise<any> {
    return await this.solicitudEfectivoRepository.findOne({
      where: { id: solicitudId }
    });
  }

  async updateSolicitudStatus(solicitudId: number, newStatus: number): Promise<void> {
    await this.solicitudEfectivoRepository.update(solicitudId, { statusId: newStatus });
  }

  async query(sql: string, parameters?: any[]): Promise<any> {
    return await this.desembolsoRepository.query(sql, parameters);
  }
}
