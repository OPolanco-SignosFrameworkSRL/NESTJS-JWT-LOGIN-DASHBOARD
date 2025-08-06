import { ISolicitudGeneralResponse, ISolicitudGeneralFilters, ISolicitudGeneralStats } from './solicitud-general.interface';
import { UserRole } from './user.interface';

export interface ISolicitudGeneralService {
  findAll(): Promise<ISolicitudGeneralResponse[]>;
  findById(id: number): Promise<ISolicitudGeneralResponse | null>;
  findByUser(userId: number): Promise<ISolicitudGeneralResponse[]>;
  findByFilters(filters: ISolicitudGeneralFilters): Promise<ISolicitudGeneralResponse[]>;
  getStats(): Promise<ISolicitudGeneralStats>;
  approve(
    id: number,
    currentUser: { id: number; role: UserRole },
    notes?: string
  ): Promise<ISolicitudGeneralResponse>;
  reject(
    id: number,
    currentUser: { id: number; role: UserRole },
    notes?: string
  ): Promise<ISolicitudGeneralResponse>;
} 