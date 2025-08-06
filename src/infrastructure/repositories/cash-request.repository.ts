import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashRequestEntity } from '../database/entities/cash-request.entity';
import { CashRequestWriteEntity } from '../database/entities/cash-request-write.entity';
import { ICashRequestRepository, ICashRequestWriteRepository } from '../../core/domain/repositories/cash-request.repository.interface';
import { CashRequest } from '../../core/domain/entities/cash-request.entity';
import { CashRequestWrite } from '../../core/domain/entities/cash-request-write.entity';
import { ICashRequestFilters, ICashRequestStats } from '../../core/domain/cash-request.interface';

@Injectable()
export class CashRequestRepository implements ICashRequestRepository {
  constructor(
    @InjectRepository(CashRequestEntity)
    private readonly cashRequestRepository: Repository<CashRequestEntity>,
  ) {}

  async findAll(): Promise<CashRequest[]> {
    try {
      console.log('Iniciando findAll en CashRequestRepository');
      const cashRequests = await this.cashRequestRepository.find({
        order: { fechacreada: 'DESC' },
      });
      console.log(`Encontradas ${cashRequests.length} solicitudes en la base de datos`);

      return cashRequests.map(cashRequest => new CashRequest(
        cashRequest.id,
        cashRequest.fechacreada,
        cashRequest.solicitada_porid,
        Number(cashRequest.monto_solicitado),
        cashRequest.solicitud_tipo,
        cashRequest.solicitud_status,
        cashRequest.divicionid,
        cashRequest.tipo_pago,
        cashRequest.produccion,
        cashRequest.autorizado_porid,
        cashRequest.fecha_requerida,
        cashRequest.departamento,
        cashRequest.concepto,
        cashRequest.fecha_orden_prod,
        cashRequest.num_orden_prod,
        cashRequest.num_ticket_prod,
        cashRequest.nombre_cliente,
        cashRequest.solicitud_numero,
        cashRequest.fecha_rechazada,
        cashRequest.razon_rechazon,
        cashRequest.usuarionombre,
        cashRequest.autorizadopor_nombre,
        cashRequest.cedula,
        cashRequest.division_nombre,
        cashRequest.estatus_desc,
        cashRequest.estatus_icon,
        cashRequest.solicitud_tipo_desc,
        cashRequest.tipo_pago_desc,
        cashRequest.verificadopor_nombre,
      ));
    } catch (error) {
      console.error('Error en findAll del repositorio:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<CashRequest | null> {
    const cashRequest = await this.cashRequestRepository.findOne({
      where: { id },
    });

    if (!cashRequest) return null;

    return new CashRequest(
      cashRequest.id,
      cashRequest.fechacreada,
      cashRequest.solicitada_porid,
      Number(cashRequest.monto_solicitado),
      cashRequest.solicitud_tipo,
      cashRequest.solicitud_status,
      cashRequest.divicionid,
      cashRequest.tipo_pago,
      cashRequest.produccion,
      cashRequest.autorizado_porid,
      cashRequest.fecha_requerida,
      cashRequest.departamento,
      cashRequest.concepto,
      cashRequest.fecha_orden_prod,
      cashRequest.num_orden_prod,
      cashRequest.num_ticket_prod,
      cashRequest.nombre_cliente,
      cashRequest.solicitud_numero,
      cashRequest.fecha_rechazada,
      cashRequest.razon_rechazon,
      cashRequest.usuarionombre,
      cashRequest.autorizadopor_nombre,
      cashRequest.cedula,
      cashRequest.division_nombre,
      cashRequest.estatus_desc,
      cashRequest.estatus_icon,
      cashRequest.solicitud_tipo_desc,
      cashRequest.tipo_pago_desc,
      cashRequest.verificadopor_nombre,
    );
  }

  async findByUser(userId: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestRepository.find({
      where: { solicitada_porid: userId },
      order: { fechacreada: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.fechacreada,
      cashRequest.solicitada_porid,
      Number(cashRequest.monto_solicitado),
      cashRequest.solicitud_tipo,
      cashRequest.solicitud_status,
      cashRequest.divicionid,
      cashRequest.tipo_pago,
      cashRequest.produccion,
      cashRequest.autorizado_porid,
      cashRequest.fecha_requerida,
      cashRequest.departamento,
      cashRequest.concepto,
      cashRequest.fecha_orden_prod,
      cashRequest.num_orden_prod,
      cashRequest.num_ticket_prod,
      cashRequest.nombre_cliente,
      cashRequest.solicitud_numero,
      cashRequest.fecha_rechazada,
      cashRequest.razon_rechazon,
      cashRequest.usuarionombre,
      cashRequest.autorizadopor_nombre,
      cashRequest.cedula,
      cashRequest.division_nombre,
      cashRequest.estatus_desc,
      cashRequest.estatus_icon,
      cashRequest.solicitud_tipo_desc,
      cashRequest.tipo_pago_desc,
      cashRequest.verificadopor_nombre,
    ));
  }

  async findByStatus(status: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestRepository.find({
      where: { solicitud_status: status },
      order: { fechacreada: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.fechacreada,
      cashRequest.solicitada_porid,
      Number(cashRequest.monto_solicitado),
      cashRequest.solicitud_tipo,
      cashRequest.solicitud_status,
      cashRequest.divicionid,
      cashRequest.tipo_pago,
      cashRequest.produccion,
      cashRequest.autorizado_porid,
      cashRequest.fecha_requerida,
      cashRequest.departamento,
      cashRequest.concepto,
      cashRequest.fecha_orden_prod,
      cashRequest.num_orden_prod,
      cashRequest.num_ticket_prod,
      cashRequest.nombre_cliente,
      cashRequest.solicitud_numero,
      cashRequest.fecha_rechazada,
      cashRequest.razon_rechazon,
      cashRequest.usuarionombre,
      cashRequest.autorizadopor_nombre,
      cashRequest.cedula,
      cashRequest.division_nombre,
      cashRequest.estatus_desc,
      cashRequest.estatus_icon,
      cashRequest.solicitud_tipo_desc,
      cashRequest.tipo_pago_desc,
      cashRequest.verificadopor_nombre,
    ));
  }

  async findByDivision(divicionid: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestRepository.find({
      where: { divicionid: divicionid },
      order: { fechacreada: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.fechacreada,
      cashRequest.solicitada_porid,
      Number(cashRequest.monto_solicitado),
      cashRequest.solicitud_tipo,
      cashRequest.solicitud_status,
      cashRequest.divicionid,
      cashRequest.tipo_pago,
      cashRequest.produccion,
      cashRequest.autorizado_porid,
      cashRequest.fecha_requerida,
      cashRequest.departamento,
      cashRequest.concepto,
      cashRequest.fecha_orden_prod,
      cashRequest.num_orden_prod,
      cashRequest.num_ticket_prod,
      cashRequest.nombre_cliente,
      cashRequest.solicitud_numero,
      cashRequest.fecha_rechazada,
      cashRequest.razon_rechazon,
      cashRequest.usuarionombre,
      cashRequest.autorizadopor_nombre,
      cashRequest.cedula,
      cashRequest.division_nombre,
      cashRequest.estatus_desc,
      cashRequest.estatus_icon,
      cashRequest.solicitud_tipo_desc,
      cashRequest.tipo_pago_desc,
      cashRequest.verificadopor_nombre,
    ));
  }

  async findByFilters(filters: ICashRequestFilters): Promise<CashRequest[]> {
    const queryBuilder = this.cashRequestRepository
      .createQueryBuilder('cashRequest');

    if (filters.status) {
      queryBuilder.andWhere('cashRequest.solicitud_status = :status', { status: filters.status });
    }

    if (filters.division) {
      queryBuilder.andWhere('cashRequest.divicionid = :division', { division: filters.division });
    }

    if (filters.requestType) {
      queryBuilder.andWhere('cashRequest.solicitud_tipo = :requestType', { requestType: filters.requestType });
    }

    if (filters.requestedBy) {
      queryBuilder.andWhere('cashRequest.solicitada_porid = :requestedBy', { requestedBy: filters.requestedBy });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('cashRequest.fechacreada >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('cashRequest.fechacreada <= :endDate', { endDate: filters.endDate });
    }

    if (filters.minAmount) {
      queryBuilder.andWhere('cashRequest.monto_solicitado >= :minAmount', { minAmount: filters.minAmount });
    }

    if (filters.maxAmount) {
      queryBuilder.andWhere('cashRequest.monto_solicitado <= :maxAmount', { maxAmount: filters.maxAmount });
    }

    queryBuilder.orderBy('cashRequest.fechacreada', 'DESC');

    const cashRequests = await queryBuilder.getMany();

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.fechacreada,
      cashRequest.solicitada_porid,
      Number(cashRequest.monto_solicitado),
      cashRequest.solicitud_tipo,
      cashRequest.solicitud_status,
      cashRequest.divicionid,
      cashRequest.tipo_pago,
      cashRequest.produccion,
      cashRequest.autorizado_porid,
      cashRequest.fecha_requerida,
      cashRequest.departamento,
      cashRequest.concepto,
      cashRequest.fecha_orden_prod,
      cashRequest.num_orden_prod,
      cashRequest.num_ticket_prod,
      cashRequest.nombre_cliente,
      cashRequest.solicitud_numero,
      cashRequest.fecha_rechazada,
      cashRequest.razon_rechazon,
      cashRequest.usuarionombre,
      cashRequest.autorizadopor_nombre,
      cashRequest.cedula,
      cashRequest.division_nombre,
      cashRequest.estatus_desc,
      cashRequest.estatus_icon,
      cashRequest.solicitud_tipo_desc,
      cashRequest.tipo_pago_desc,
      cashRequest.verificadopor_nombre,
    ));
  }

  async getStats(): Promise<ICashRequestStats> {
    const totalRequests = await this.cashRequestRepository.count();

    const pendingRequests = await this.cashRequestRepository.count({
      where: { solicitud_status: 1 }, // Asumiendo que 1 = PENDIENTE
    });

    const approvedRequests = await this.cashRequestRepository.count({
      where: { solicitud_status: 2 }, // Asumiendo que 2 = APROBADO
    });

    const rejectedRequests = await this.cashRequestRepository.count({
      where: { solicitud_status: 3 }, // Asumiendo que 3 = RECHAZADO
    });

    const totalAmountResult = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('SUM(cashRequest.monto_solicitado)', 'total')
      .getRawOne();

    const totalAmount = Number(totalAmountResult?.total || 0);

    const requestsByStatus = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.solicitud_status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cashRequest.solicitud_status')
      .getRawMany();

    const requestsByDivision = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.divicionid', 'division')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cashRequest.divicionid')
      .getRawMany();

    const requestsByType = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.solicitud_tipo', 'requestType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cashRequest.solicitud_tipo')
      .getRawMany();

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalAmount,
      requestsByStatus: requestsByStatus.map(item => ({
        status: item.status,
        count: Number(item.count),
      })),
      requestsByDivision: requestsByDivision.map(item => ({
        division: item.division,
        count: Number(item.count),
      })),
      requestsByType: requestsByType.map(item => ({
        requestType: item.requestType,
        count: Number(item.count),
      })),
    };
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.cashRequestRepository.count({
      where: { id },
    });
    return count > 0;
  }
}

@Injectable()
export class CashRequestWriteRepository implements ICashRequestWriteRepository {
  constructor(
    @InjectRepository(CashRequestWriteEntity)
    private readonly cashRequestWriteRepository: Repository<CashRequestWriteEntity>,
  ) {}

  async findById(id: number): Promise<CashRequestWrite | null> {
    const cashRequest = await this.cashRequestWriteRepository.findOne({
      where: { id },
    });

    if (!cashRequest) return null;

    return new CashRequestWrite(
      cashRequest.id,
      cashRequest.fechacreada,
      cashRequest.solicitada_porid,
      Number(cashRequest.monto_solicitado),
      cashRequest.solicitud_tipo,
      cashRequest.solicitud_status,
      cashRequest.divicionid,
      cashRequest.tipo_pago,
      cashRequest.produccion,
      cashRequest.autorizado_porid,
      cashRequest.fecha_requerida,
      cashRequest.departamento,
      cashRequest.concepto,
      cashRequest.fecha_orden_prod,
      cashRequest.num_orden_prod,
      cashRequest.num_ticket_prod,
      cashRequest.nombre_cliente,
      cashRequest.solicitud_numero,
      cashRequest.fecha_rechazada,
      cashRequest.razon_rechazon,
      cashRequest.usuarionombre,
      cashRequest.autorizadopor_nombre,
      cashRequest.cedula,
      cashRequest.division_nombre,
      cashRequest.estatus_desc,
      cashRequest.estatus_icon,
      cashRequest.solicitud_tipo_desc,
      cashRequest.tipo_pago_desc,
      cashRequest.verificadopor_nombre,
    );
  }

  async create(cashRequestData: Partial<CashRequestWrite>): Promise<CashRequestWrite> {
    const cashRequest = this.cashRequestWriteRepository.create(cashRequestData);
    const savedCashRequest = await this.cashRequestWriteRepository.save(cashRequest);

    return new CashRequestWrite(
      savedCashRequest.id,
      savedCashRequest.fechacreada,
      savedCashRequest.solicitada_porid,
      Number(savedCashRequest.monto_solicitado),
      savedCashRequest.solicitud_tipo,
      savedCashRequest.solicitud_status,
      savedCashRequest.divicionid,
      savedCashRequest.tipo_pago,
      savedCashRequest.produccion,
      savedCashRequest.autorizado_porid,
      savedCashRequest.fecha_requerida,
      savedCashRequest.departamento,
      savedCashRequest.concepto,
      savedCashRequest.fecha_orden_prod,
      savedCashRequest.num_orden_prod,
      savedCashRequest.num_ticket_prod,
      savedCashRequest.nombre_cliente,
      savedCashRequest.solicitud_numero,
      savedCashRequest.fecha_rechazada,
      savedCashRequest.razon_rechazon,
      savedCashRequest.usuarionombre,
      savedCashRequest.autorizadopor_nombre,
      savedCashRequest.cedula,
      savedCashRequest.division_nombre,
      savedCashRequest.estatus_desc,
      savedCashRequest.estatus_icon,
      savedCashRequest.solicitud_tipo_desc,
      savedCashRequest.tipo_pago_desc,
      savedCashRequest.verificadopor_nombre,
    );
  }

  async update(id: number, cashRequestData: Partial<CashRequestWrite>): Promise<CashRequestWrite> {
    await this.cashRequestWriteRepository.update(id, cashRequestData);
    const updatedCashRequest = await this.cashRequestWriteRepository.findOne({
      where: { id },
    });

    if (!updatedCashRequest) {
      throw new Error(`Solicitud de efectivo con ID ${id} no encontrada`);
    }

    return new CashRequestWrite(
      updatedCashRequest.id,
      updatedCashRequest.fechacreada,
      updatedCashRequest.solicitada_porid,
      Number(updatedCashRequest.monto_solicitado),
      updatedCashRequest.solicitud_tipo,
      updatedCashRequest.solicitud_status,
      updatedCashRequest.divicionid,
      updatedCashRequest.tipo_pago,
      updatedCashRequest.produccion,
      updatedCashRequest.autorizado_porid,
      updatedCashRequest.fecha_requerida,
      updatedCashRequest.departamento,
      updatedCashRequest.concepto,
      updatedCashRequest.fecha_orden_prod,
      updatedCashRequest.num_orden_prod,
      updatedCashRequest.num_ticket_prod,
      updatedCashRequest.nombre_cliente,
      updatedCashRequest.solicitud_numero,
      updatedCashRequest.fecha_rechazada,
      updatedCashRequest.razon_rechazon,
      updatedCashRequest.usuarionombre,
      updatedCashRequest.autorizadopor_nombre,
      updatedCashRequest.cedula,
      updatedCashRequest.division_nombre,
      updatedCashRequest.estatus_desc,
      updatedCashRequest.estatus_icon,
      updatedCashRequest.solicitud_tipo_desc,
      updatedCashRequest.tipo_pago_desc,
      updatedCashRequest.verificadopor_nombre,
    );
  }

  async delete(id: number): Promise<void> {
    const cashRequest = await this.cashRequestWriteRepository.findOne({
      where: { id },
    });

    if (!cashRequest) {
      throw new Error(`Solicitud de efectivo con ID ${id} no encontrada`);
    }

    await this.cashRequestWriteRepository.remove(cashRequest);
  }

  async findAll(): Promise<CashRequestWrite[]> {
    const cashRequests = await this.cashRequestWriteRepository.find({
      order: { id: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequestWrite(
      cashRequest.id,
      cashRequest.fechacreada,
      cashRequest.solicitada_porid,
      Number(cashRequest.monto_solicitado),
      cashRequest.solicitud_tipo,
      cashRequest.solicitud_status,
      cashRequest.divicionid,
      cashRequest.tipo_pago,
      cashRequest.produccion,
      cashRequest.autorizado_porid,
      cashRequest.fecha_requerida,
      cashRequest.departamento,
      cashRequest.concepto,
      cashRequest.fecha_orden_prod,
      cashRequest.num_orden_prod,
      cashRequest.num_ticket_prod,
      cashRequest.nombre_cliente,
      cashRequest.solicitud_numero,
      cashRequest.fecha_rechazada,
      cashRequest.razon_rechazon,
      cashRequest.usuarionombre,
      cashRequest.autorizadopor_nombre,
      cashRequest.cedula,
      cashRequest.division_nombre,
      cashRequest.estatus_desc,
      cashRequest.estatus_icon,
      cashRequest.solicitud_tipo_desc,
      cashRequest.tipo_pago_desc,
      cashRequest.verificadopor_nombre,
    ));
  }


} 
