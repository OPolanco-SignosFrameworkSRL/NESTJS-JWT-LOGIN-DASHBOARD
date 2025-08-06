import { CashRequest } from '../entities/cash-request.entity';
import { CashRequestWrite } from '../entities/cash-request-write.entity';
import { ICashRequestFilters, ICashRequestStats } from '../cash-request.interface';

export interface ICashRequestRepository {
  findAll(): Promise<CashRequest[]>;
  findById(id: number): Promise<CashRequest | null>;
  findByUser(userId: number): Promise<CashRequest[]>;
  findByStatus(status: number): Promise<CashRequest[]>;
  findByDivision(divisionId: number): Promise<CashRequest[]>;
  findByFilters(filters: ICashRequestFilters): Promise<CashRequest[]>;
  getStats(): Promise<ICashRequestStats>;
  exists(id: number): Promise<boolean>;
}

export interface ICashRequestWriteRepository {
  findById(id: number): Promise<CashRequestWrite | null>;
  create(cashRequestData: Partial<CashRequestWrite>): Promise<CashRequestWrite>;
  update(id: number, cashRequestData: Partial<CashRequestWrite>): Promise<CashRequestWrite>;
  delete(id: number): Promise<void>;
  findAll(): Promise<CashRequestWrite[]>;
} 