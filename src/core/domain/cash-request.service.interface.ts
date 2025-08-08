import { ICashRequestResponse, ICashRequestFilters, ICashRequestStats } from './interfaces/cash-request.interface';
import { UserRole } from './interfaces/user.interface';

export interface ICashRequestService {
  findAll(): Promise<ICashRequestResponse[]>;
  findById(id: number): Promise<ICashRequestResponse | null>;
  findByUser(userId: number): Promise<ICashRequestResponse[]>;
  findByFilters(filters: ICashRequestFilters): Promise<ICashRequestResponse[]>;
  getStats(): Promise<ICashRequestStats>;
  create(
    cashRequestData: any,
    currentUser: { sub: number; role: UserRole }
  ): Promise<ICashRequestResponse>;
  update(
    id: number,
    cashRequestData: any,
    currentUser: { sub: number; role: UserRole }
  ): Promise<ICashRequestResponse>;
  approve(
    id: number,
    currentUser: { sub: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse>;
  reject(
    id: number,
    currentUser: { sub: number; role: UserRole },
    notes?: string
  ): Promise<ICashRequestResponse>;
  remove(
    id: number,
    currentUser: { sub: number; role: UserRole },
    confirmPermanentDelete?: boolean,
    reason?: string
  ): Promise<{ message: string; type: 'soft' | 'permanent'; cashRequest: any }>;
  restore(
    id: number,
    currentUser: { sub: number; role: UserRole }
  ): Promise<{ message: string; cashRequest: any }>;
  findDeleted(): Promise<ICashRequestResponse[]>;
} 