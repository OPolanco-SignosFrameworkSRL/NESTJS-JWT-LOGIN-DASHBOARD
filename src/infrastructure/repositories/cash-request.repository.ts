import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICashRequestRepository } from '../../core/domain/repositories/cash-request.repository.interface';
import { CashRequest } from '../../core/domain/entities/cash-request.entity';
import { CashRequestEntity } from '../database/entities/cash-request.entity';
import { CashRequestWriteEntity } from '../database/entities/cash-request-write.entity';
import { ICashRequestFilters, ICashRequestStats, CashRequestStatus, CashRequestType, PaymentType } from '../../core/domain/interfaces/cash-request.interface';

/**
 * Implementación del repositorio de solicitudes de efectivo
 * Maneja el acceso a datos de solicitudes en la base de datos
 */
@Injectable()
export class CashRequestRepository implements ICashRequestRepository {
  constructor(
    @InjectRepository(CashRequestEntity)
    private readonly cashRequestReadRepository: Repository<CashRequestEntity>,
    @InjectRepository(CashRequestWriteEntity)
    private readonly cashRequestWriteRepository: Repository<CashRequestWriteEntity>,
  ) {}

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private mapToDomain(cashRequestEntity: CashRequestEntity): CashRequest {
    return new CashRequest(
      cashRequestEntity.id,
      cashRequestEntity.fechacreada,
      cashRequestEntity.solicitada_porid,
      cashRequestEntity.solicitud_tipo as CashRequestType,
      cashRequestEntity.solicitud_status as CashRequestStatus,
      cashRequestEntity.monto_solicitado,
      cashRequestEntity.concepto || '',
      cashRequestEntity.divicionid,
      cashRequestEntity.tipo_pago as PaymentType,
      cashRequestEntity.autorizado_porid,
      cashRequestEntity.fecha_requerida,
      cashRequestEntity.departamento,
      cashRequestEntity.fecha_orden_prod,
      cashRequestEntity.num_orden_prod,
      cashRequestEntity.num_ticket_prod,
      cashRequestEntity.nombre_cliente,
      cashRequestEntity.solicitud_numero,
      cashRequestEntity.fecha_rechazada,
      cashRequestEntity.razon_rechazon,
      cashRequestEntity.produccion === 1,
    );
  }

  /**
   * Encuentra todas las solicitudes con filtros opcionales
   */
  async findAll(filters?: ICashRequestFilters): Promise<CashRequest[]> {
    const query = this.cashRequestReadRepository.createQueryBuilder('cashRequest');

    if (filters?.status) {
      query.andWhere('cashRequest.solicitud_status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('cashRequest.solicitud_tipo = :type', { type: filters.type });
    }

    if (filters?.division) {
      query.andWhere('cashRequest.divicionid = :division', { division: filters.division });
    }

    if (filters?.paymentType) {
      query.andWhere('cashRequest.tipo_pago = :paymentType', { paymentType: filters.paymentType });
    }

    if (filters?.startDate) {
      query.andWhere('cashRequest.fechacreada >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('cashRequest.fechacreada <= :endDate', { endDate: filters.endDate });
    }

    if (filters?.minAmount) {
      query.andWhere('cashRequest.monto_solicitado >= :minAmount', { minAmount: filters.minAmount });
    }

    if (filters?.maxAmount) {
      query.andWhere('cashRequest.monto_solicitado <= :maxAmount', { maxAmount: filters.maxAmount });
    }

    if (filters?.search) {
      query.andWhere(
        '(cashRequest.concepto LIKE :search OR cashRequest.nombre_cliente LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    if (filters?.offset) {
      query.offset(filters.offset);
    }

    const cashRequests = await query.getMany();
    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Encuentra una solicitud por ID
   */
  async findById(id: number): Promise<CashRequest | null> {
    const cashRequest = await this.cashRequestReadRepository.findOne({ where: { id } });
    return cashRequest ? this.mapToDomain(cashRequest) : null;
  }

  /**
   * Encuentra solicitudes por usuario solicitante
   */
  async findByUserId(userId: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestReadRepository.find({ 
      where: { solicitada_porid: userId } 
    });
    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Encuentra solicitudes por estado
   */
  async findByStatus(status: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestReadRepository.find({ 
      where: { solicitud_status: status } 
    });
    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Encuentra solicitudes por tipo
   */
  async findByType(type: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestReadRepository.find({ 
      where: { solicitud_tipo: type } 
    });
    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Encuentra solicitudes por división
   */
  async findByDivision(divisionId: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestReadRepository.find({ 
      where: { divicionid: divisionId } 
    });
    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Busca solicitudes por término
   */
  async searchByTerm(term: string): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .where(
        'cashRequest.concepto LIKE :term OR cashRequest.nombre_cliente LIKE :term',
        { term: `%${term}%` }
      )
      .getMany();

    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Genera el siguiente número de solicitud automáticamente
   */
  private async getNextSolicitudNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    
    // Buscar la última solicitud del año actual
    const lastSolicitud = await this.cashRequestWriteRepository
      .createQueryBuilder('solicitud')
      .where('solicitud.solicitud_numero LIKE :pattern', { pattern: `${currentYear}-%` })
      .andWhere('solicitud.solicitud_numero IS NOT NULL')
      .orderBy('solicitud.solicitud_numero', 'DESC')
      .getOne();

    if (!lastSolicitud || !lastSolicitud.solicitud_numero) {
      // Si no hay solicitudes este año, empezar con 00001
      return `${currentYear}-00001`;
    }

    // Extraer el número de la última solicitud (ej: "2025-00004" → 4)
    const lastNumber = parseInt(lastSolicitud.solicitud_numero.split('-')[1]);
    const nextNumber = lastNumber + 1;
    
    // Formatear con 5 dígitos (ej: 5 → "00005")
    return `${currentYear}-${nextNumber.toString().padStart(5, '0')}`;
  }

  /**
   * Crea una nueva solicitud
   */
  async create(cashRequestData: any): Promise<CashRequest> {
    // Generar número de solicitud automáticamente
    const solicitudNumero = await this.getNextSolicitudNumber();
    
    // Establecer valores por defecto según los campos requeridos
    const requestData = {
      ...cashRequestData,
      solicitud_status: 1, // PENDIENTE por defecto
      fechacreada: new Date(),
      solicitud_numero: solicitudNumero, // ← AQUÍ se asigna el número generado
      // Campos opcionales que pueden ser null
      autorizado_porid: null,
      fecha_orden_prod: null,
      num_orden_prod: null,
      num_ticket_prod: null,
      nombre_cliente: null,
      fecha_rechazada: null,
      razon_rechazon: null,
      fecha_aprobada: null,
      verificada_porid: null,
      cedula_autoriza: null,
    };
    
    const newCashRequest = this.cashRequestWriteRepository.create(requestData);
    const savedRequest = await this.cashRequestWriteRepository.save(newCashRequest);
    
    // Asegurar que tenemos un objeto, no un array
    const request = Array.isArray(savedRequest) ? savedRequest[0] : savedRequest;
    
    // Crear una entidad de dominio básica con los datos guardados
    return new CashRequest(
      request.id,
      request.fechacreada,
      request.solicitada_porid,
      request.solicitud_tipo as any,
      request.solicitud_status as any,
      request.monto_solicitado,
      request.concepto || '',
      request.divicionid,
      request.tipo_pago as any,
      request.autorizado_porid,
      request.fecha_requerida,
      request.departamento,
      request.fecha_orden_prod,
      request.num_orden_prod,
      request.num_ticket_prod,
      request.nombre_cliente,
      request.solicitud_numero,
      request.fecha_rechazada,
      request.razon_rechazon,
      // request.produccion === 1, // Campo comentado porque no existe en la tabla
    );
  }

  /**
   * Actualiza una solicitud existente
   */
  async update(id: number, cashRequestData: any): Promise<CashRequest> {
    await this.cashRequestWriteRepository.update(id, cashRequestData);
    
    const updatedCashRequest = await this.cashRequestReadRepository.findOne({ where: { id } });
    return this.mapToDomain(updatedCashRequest!);
  }

  // Métodos removidos - ahora se usa updateStatus para todas las acciones

  /**
   * Liquidar una solicitud
   */
  async liquidate(id: number): Promise<CashRequest> {
    await this.cashRequestWriteRepository.update(id, { 
      solicitud_status: CashRequestStatus.DESEMBOLSADO 
    });
    
    const liquidatedCashRequest = await this.cashRequestReadRepository.findOne({ where: { id } });
    return this.mapToDomain(liquidatedCashRequest!);
  }

  /**
   * Elimina una solicitud (soft delete)
   */
  async delete(id: number): Promise<void> {
    // Implementar soft delete si es necesario
    await this.cashRequestWriteRepository.delete(id);
  }

  /**
   * Restaura una solicitud eliminada
   */
  async restore(id: number): Promise<CashRequest> {
    // Implementar restauración si es necesario
    const restoredCashRequest = await this.cashRequestReadRepository.findOne({ where: { id } });
    return this.mapToDomain(restoredCashRequest!);
  }

  /**
   * Encuentra solicitudes eliminadas
   */
  async findDeleted(): Promise<CashRequest[]> {
    // Implementar búsqueda de eliminados si es necesario
    return [];
  }

  /**
   * Obtiene estadísticas de solicitudes
   */
  async getStats(): Promise<ICashRequestStats> {
    const total = await this.cashRequestReadRepository.count();
    const pending = await this.cashRequestReadRepository.count({ 
      where: { solicitud_status: CashRequestStatus.PENDIENTE } 
    });
    const approved = await this.cashRequestReadRepository.count({ 
      where: { solicitud_status: CashRequestStatus.APROBADA } 
    });
    const rejected = await this.cashRequestReadRepository.count({ 
      where: { solicitud_status: CashRequestStatus.RECHAZADA } 
    });
    const liquidated = await this.cashRequestReadRepository.count({ 
      where: { solicitud_status: CashRequestStatus.DESEMBOLSADO } 
    });

    // Calcular montos totales
    const totalAmountResult = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .select('SUM(cashRequest.monto_solicitado)', 'total')
      .getRawOne();

    const totalAmount = parseFloat(totalAmountResult?.total || '0');
    const averageAmount = total > 0 ? totalAmount / total : 0;

    // Estadísticas por estado
    const statusStats = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.solicitud_status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cashRequest.solicitud_status')
      .getRawMany();

    const byStatus: Record<CashRequestStatus, number> = {
      [CashRequestStatus.PENDIENTE]: 0,
      [CashRequestStatus.APROBADA]: 0,
      [CashRequestStatus.AUTORIZADO]: 0,
      [CashRequestStatus.RECHAZADA]: 0,
      [CashRequestStatus.DESEMBOLSADO]: 0,
    };

    statusStats.forEach(stat => {
      byStatus[stat.status as CashRequestStatus] = parseInt(stat.count);
    });

    // Estadísticas por tipo
    const typeStats = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.solicitud_tipo', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cashRequest.solicitud_tipo')
      .getRawMany();

    const byType: Record<CashRequestType, number> = {
      [CashRequestType.COMPRA_MATERIALES]: 0,
      [CashRequestType.REEMBOLSO]: 0,
      [CashRequestType.OTROS]: 0,
    };

    typeStats.forEach(stat => {
      byType[stat.type as CashRequestType] = parseInt(stat.count);
    });

    // Estadísticas por división
    const divisionStats = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.divicionid', 'division')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cashRequest.divicionid')
      .getRawMany();

    const byDivision: Record<number, number> = {};
    divisionStats.forEach(stat => {
      byDivision[stat.division] = parseInt(stat.count);
    });

    // Estadísticas por tipo de pago
    const paymentTypeStats = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.tipo_pago', 'paymentType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cashRequest.tipo_pago')
      .getRawMany();

    const byPaymentType: Record<PaymentType, number> = {
      [PaymentType.EFECTIVO]: 0,
      [PaymentType.TRANSFERENCIA]: 0,
      [PaymentType.CHEQUE]: 0,
    };

    paymentTypeStats.forEach(stat => {
      byPaymentType[stat.paymentType as PaymentType] = parseInt(stat.count);
    });

    return {
      total,
      pending,
      approved,
      rejected,
      liquidated,
      totalAmount,
      averageAmount,
      byStatus,
      byType,
      byDivision,
      byPaymentType,
    };
  }

  /**
   * Obtiene solicitudes por rango de fechas
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .where('cashRequest.fechacreada BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Obtiene solicitudes por rango de montos
   */
  async findByAmountRange(minAmount: number, maxAmount: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestReadRepository
      .createQueryBuilder('cashRequest')
      .where('cashRequest.monto_solicitado BETWEEN :minAmount AND :maxAmount', { minAmount, maxAmount })
      .getMany();

    return cashRequests.map(cashRequest => this.mapToDomain(cashRequest));
  }

  /**
   * Actualiza el estado de una solicitud (método genérico para admin)
   */
  async updateStatus(
    id: number, 
    newStatus: number, 
    adminUserId: number, 
    action: string, 
    comment?: string, 
    actionDate?: Date
  ): Promise<CashRequest> {
    // Obtener la solicitud actual
    const currentRequest = await this.cashRequestWriteRepository.findOne({ where: { id } });
    if (!currentRequest) {
      throw new Error(`Solicitud con ID ${id} no encontrada`);
    }

    // Actualizar el estado
    currentRequest.solicitud_status = newStatus;

    // Actualizar campos según la acción
    switch (action) {
      case 'approve':
        currentRequest.fecha_aprobada = actionDate || new Date();
        currentRequest.verificada_porid = adminUserId;
        break;
      
      case 'authorize':
        currentRequest.autorizado_porid = adminUserId;
        currentRequest.cedula_autoriza = adminUserId.toString(); // Temporal, se puede mejorar
        break;
      
      case 'reject':
        currentRequest.fecha_rechazada = actionDate || new Date();
        currentRequest.razon_rechazon = comment || 'Rechazada por administrador';
        break;
    }

    // Guardar los cambios
    const updatedRequest = await this.cashRequestWriteRepository.save(currentRequest);
    
    // Retornar la entidad de dominio actualizada
    const updatedReadRequest = await this.cashRequestReadRepository.findOne({ where: { id } });
    if (!updatedReadRequest) {
      throw new Error('Error al obtener la solicitud actualizada');
    }
    
    return this.mapToDomain(updatedReadRequest);
  }
}
