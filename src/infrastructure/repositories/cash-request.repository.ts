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
    const cashRequests = await this.cashRequestRepository.find({
      where: { valido: '1' },
      order: { createdAt: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
    ));
  }

  async findById(id: number): Promise<CashRequest | null> {
    const cashRequest = await this.cashRequestRepository.findOne({
      where: { id, valido: '1' },
    });

    if (!cashRequest) return null;

    return new CashRequest(
      cashRequest.id,
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
    );
  }

  async findByUser(userId: number): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestRepository.find({
      where: { requestedBy: userId, valido: '1' },
      order: { createdAt: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
    ));
  }

  async findByStatus(status: string): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestRepository.find({
      where: { status, valido: '1' },
      order: { createdAt: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
    ));
  }

  async findByDivision(division: string): Promise<CashRequest[]> {
    const cashRequests = await this.cashRequestRepository.find({
      where: { division, valido: '1' },
      order: { createdAt: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
    ));
  }

  async findByFilters(filters: ICashRequestFilters): Promise<CashRequest[]> {
    const queryBuilder = this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .where('cashRequest.valido = :valido', { valido: '1' });

    if (filters.status) {
      queryBuilder.andWhere('cashRequest.status = :status', { status: filters.status });
    }

    if (filters.division) {
      queryBuilder.andWhere('cashRequest.division = :division', { division: filters.division });
    }

    if (filters.requestType) {
      queryBuilder.andWhere('cashRequest.requestType = :requestType', { requestType: filters.requestType });
    }

    if (filters.requestedBy) {
      queryBuilder.andWhere('cashRequest.requestedBy = :requestedBy', { requestedBy: filters.requestedBy });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('cashRequest.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('cashRequest.createdAt <= :endDate', { endDate: filters.endDate });
    }

    if (filters.minAmount) {
      queryBuilder.andWhere('cashRequest.requestedAmount >= :minAmount', { minAmount: filters.minAmount });
    }

    if (filters.maxAmount) {
      queryBuilder.andWhere('cashRequest.requestedAmount <= :maxAmount', { maxAmount: filters.maxAmount });
    }

    queryBuilder.orderBy('cashRequest.createdAt', 'DESC');

    const cashRequests = await queryBuilder.getMany();

    return cashRequests.map(cashRequest => new CashRequest(
      cashRequest.id,
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
    ));
  }

  async getStats(): Promise<ICashRequestStats> {
    const totalRequests = await this.cashRequestRepository.count({
      where: { valido: '1' },
    });

    const pendingRequests = await this.cashRequestRepository.count({
      where: { status: 'PENDIENTE', valido: '1' },
    });

    const approvedRequests = await this.cashRequestRepository.count({
      where: { status: 'APROBADO', valido: '1' },
    });

    const rejectedRequests = await this.cashRequestRepository.count({
      where: { status: 'RECHAZADO', valido: '1' },
    });

    const totalAmountResult = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('SUM(cashRequest.requestedAmount)', 'total')
      .where('cashRequest.valido = :valido', { valido: '1' })
      .getRawOne();

    const totalAmount = Number(totalAmountResult?.total || 0);

    const requestsByStatus = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('cashRequest.valido = :valido', { valido: '1' })
      .groupBy('cashRequest.status')
      .getRawMany();

    const requestsByDivision = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.division', 'division')
      .addSelect('COUNT(*)', 'count')
      .where('cashRequest.valido = :valido', { valido: '1' })
      .groupBy('cashRequest.division')
      .getRawMany();

    const requestsByType = await this.cashRequestRepository
      .createQueryBuilder('cashRequest')
      .select('cashRequest.requestType', 'requestType')
      .addSelect('COUNT(*)', 'count')
      .where('cashRequest.valido = :valido', { valido: '1' })
      .groupBy('cashRequest.requestType')
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
      where: { id, valido: '1' },
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
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
      cashRequest.deletedAt,
      cashRequest.deletedBy,
    );
  }

  async create(cashRequestData: Partial<CashRequestWrite>): Promise<CashRequestWrite> {
    const cashRequest = this.cashRequestWriteRepository.create(cashRequestData);
    const savedCashRequest = await this.cashRequestWriteRepository.save(cashRequest);

    return new CashRequestWrite(
      savedCashRequest.id,
      savedCashRequest.requestedBy,
      Number(savedCashRequest.requestedAmount),
      savedCashRequest.requestType,
      savedCashRequest.division,
      savedCashRequest.paymentType,
      savedCashRequest.status,
      savedCashRequest.createdAt,
      savedCashRequest.updatedAt,
      savedCashRequest.approvedBy,
      savedCashRequest.approvedAt,
      savedCashRequest.notes,
      savedCashRequest.valido,
      savedCashRequest.deletedAt,
      savedCashRequest.deletedBy,
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
      updatedCashRequest.requestedBy,
      Number(updatedCashRequest.requestedAmount),
      updatedCashRequest.requestType,
      updatedCashRequest.division,
      updatedCashRequest.paymentType,
      updatedCashRequest.status,
      updatedCashRequest.createdAt,
      updatedCashRequest.updatedAt,
      updatedCashRequest.approvedBy,
      updatedCashRequest.approvedAt,
      updatedCashRequest.notes,
      updatedCashRequest.valido,
      updatedCashRequest.deletedAt,
      updatedCashRequest.deletedBy,
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
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
      cashRequest.deletedAt,
      cashRequest.deletedBy,
    ));
  }

  async findByValid(valid: string): Promise<CashRequestWrite[]> {
    const cashRequests = await this.cashRequestWriteRepository.find({
      where: { valido: valid },
      order: { id: 'DESC' },
    });

    return cashRequests.map(cashRequest => new CashRequestWrite(
      cashRequest.id,
      cashRequest.requestedBy,
      Number(cashRequest.requestedAmount),
      cashRequest.requestType,
      cashRequest.division,
      cashRequest.paymentType,
      cashRequest.status,
      cashRequest.createdAt,
      cashRequest.updatedAt,
      cashRequest.approvedBy,
      cashRequest.approvedAt,
      cashRequest.notes,
      cashRequest.valido,
      cashRequest.deletedAt,
      cashRequest.deletedBy,
    ));
  }
} 