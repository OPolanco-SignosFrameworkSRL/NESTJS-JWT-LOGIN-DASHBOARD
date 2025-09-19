import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PagoNoLiquidadoEntity } from '../database/entities/pago-no-liquidado.entity';
import { PagoNoLiquidadoQueryDto } from '../../core/application/dto/pago-no-liquidado-query.dto';

export interface PagosNoLiquidadosResult {
  data: PagoNoLiquidadoEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class PagoNoLiquidadoRepository {
  constructor(
    @InjectRepository(PagoNoLiquidadoEntity)
    private readonly repository: Repository<PagoNoLiquidadoEntity>,
  ) {}

  /**
   * Busca pagos no liquidados con filtros y paginación
   */
  async findWithFilters(query: PagoNoLiquidadoQueryDto): Promise<PagosNoLiquidadosResult> {
    const { search, division, estado, page = 1, pageSize = 10 } = query;

    // Crear query builder base
    const queryBuilder = this.createBaseQueryBuilder();

    // Aplicar filtros
    this.applyFilters(queryBuilder, { search, division, estado });

    // Ordenar por ID descendente (más simple)
    queryBuilder.orderBy('pago.id', 'DESC');

    // Calcular offset para paginación
    const offset = (page - 1) * pageSize;

    // Obtener total de registros
    const total = await queryBuilder.getCount();

    // Aplicar paginación y obtener resultados
    const data = await queryBuilder
      .skip(offset)
      .take(pageSize)
      .getMany();

    // Calcular total de páginas
    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Busca un pago no liquidado por ID
   */
  async findById(id: number): Promise<PagoNoLiquidadoEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['creadoPor', 'tipoPagoInfo'],
    });
  }

  /**
   * Crea un nuevo pago no liquidado
   */
  async create(pagoData: Partial<PagoNoLiquidadoEntity>): Promise<PagoNoLiquidadoEntity> {
    // Asegurar que los campos requeridos estén presentes
    const dataToSave = {
      ...pagoData,
      fechaCreado: pagoData.fechaCreado || new Date(),
      estatus: pagoData.estatus ?? 1, // 1 = activo por defecto
    };
    
    console.log('Datos a guardar:', dataToSave); // Debug
    
    const pago = this.repository.create(dataToSave);
    return this.repository.save(pago);
  }

  /**
   * Actualiza un pago no liquidado existente
   */
  async update(id: number, pagoData: Partial<PagoNoLiquidadoEntity>): Promise<PagoNoLiquidadoEntity | null> {
    await this.repository.update(id, pagoData);
    return this.findById(id);
  }

  /**
   * Elimina (soft delete) un pago no liquidado
   */
  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { estatus: 0 });
    return result.affected > 0;
  }

  /**
   * Cuenta el total de adjuntos activos para un pago
   */
  async countAdjuntos(pagoId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('pago')
      .leftJoin('pago.adjuntos', 'adjunto')
      .where('pago.id = :pagoId', { pagoId })
      .andWhere('adjunto.estado = :estado', { estado: 'Activo' })
      .select('COUNT(adjunto.id)', 'count')
      .getRawOne();

    return parseInt(result?.count || '0', 10);
  }

  /**
   * Crea el query builder base con relaciones
   */
  private createBaseQueryBuilder(): SelectQueryBuilder<PagoNoLiquidadoEntity> {
    return this.repository
      .createQueryBuilder('pago')
      .leftJoinAndSelect('pago.creadoPor', 'creador')
      .leftJoinAndSelect('pago.tipoPagoInfo', 'tipoPago');
  }

  /**
   * Aplica filtros al query builder
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<PagoNoLiquidadoEntity>,
    filters: { search?: string; division?: string; estado?: string },
  ): void {
    const { search, division, estado } = filters;

    // Filtro por estado (mapear texto a número)
    if (estado) {
      let estatusNumero = 1; // Activo por defecto
      if (estado === 'Cancelado') estatusNumero = 0;
      if (estado === 'Procesado') estatusNumero = 2;
      if (estado === 'Liquidado') estatusNumero = 3;
      
      queryBuilder.andWhere('pago.estatus = :estatus', { estatus: estatusNumero });
    }

    // Filtro de búsqueda en número de desembolso y beneficiario
    if (search) {
      queryBuilder.andWhere(
        '(pago.desembolsoNumero LIKE :search OR pago.beneficiario LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filtro por tipo de pago (usando division como proxy)
    if (division) {
      queryBuilder.andWhere('tipoPago.tipo_desc LIKE :division', { 
        division: `%${division}%` 
      });
    }
  }

  /**
   * Obtiene estadísticas básicas de pagos no liquidados
   */
  async getStats(): Promise<{
    totalActivos: number;
    totalCancelados: number;
    totalGeneral: number;
    montoTotal: number;
  }> {
    const stats = await this.repository
      .createQueryBuilder('pago')
      .select([
        'SUM(CASE WHEN pago.estatus = :activo THEN 1 ELSE 0 END) as totalActivos',
        'SUM(CASE WHEN pago.estatus = :cancelado THEN 1 ELSE 0 END) as totalCancelados',
        'COUNT(*) as totalGeneral',
        'SUM(CASE WHEN pago.desembolsoMonto IS NOT NULL AND pago.estatus = :activo THEN pago.desembolsoMonto ELSE 0 END) as montoTotal',
      ])
      .setParameters({ 
        activo: 1, 
        cancelado: 0 
      })
      .getRawOne();

    return {
      totalActivos: parseInt(stats?.totalActivos || '0', 10),
      totalCancelados: parseInt(stats?.totalCancelados || '0', 10),
      totalGeneral: parseInt(stats?.totalGeneral || '0', 10),
      montoTotal: parseFloat(stats?.montoTotal || '0'),
    };
  }
}
