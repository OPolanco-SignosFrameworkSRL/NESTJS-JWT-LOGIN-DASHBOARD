import { SolicitudGeneral } from '../entities/solicitud-general.entity';
import { ISolicitudGeneralFilters, ISolicitudGeneralStats } from '../solicitud-general.interface';

export interface ISolicitudGeneralRepository {
  findAll(): Promise<SolicitudGeneral[]>;
  findById(id: number): Promise<SolicitudGeneral | null>;
  findByUser(userId: number): Promise<SolicitudGeneral[]>;
  findByStatus(status: number): Promise<SolicitudGeneral[]>;
  findByDepartamento(departamento: string): Promise<SolicitudGeneral[]>;
  findByFilters(filters: ISolicitudGeneralFilters): Promise<SolicitudGeneral[]>;
  getStats(): Promise<ISolicitudGeneralStats>;
  exists(id: number): Promise<boolean>;
} 