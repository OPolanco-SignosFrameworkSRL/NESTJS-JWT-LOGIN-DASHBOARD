import { CashRequest } from '../entities/cash-request.entity';
import { ICashRequestFilters, ICashRequestStats } from '../interfaces/cash-request.interface';

/**
 * Interfaz del repositorio de solicitudes de efectivo
 * Define los contratos para el acceso a datos de solicitudes
 * Sigue el principio de inversión de dependencias
 */
export interface ICashRequestRepository {
  /**
   * Encuentra todas las solicitudes con filtros opcionales
   */
  findAll(filters?: ICashRequestFilters): Promise<CashRequest[]>;

  /**
   * Encuentra una solicitud por ID
   */
  findById(id: number): Promise<CashRequest | null>;

  /**
   * Encuentra solicitudes por usuario solicitante
   */
  findByUserId(userId: number): Promise<CashRequest[]>;

  /**
   * Encuentra solicitudes por estado
   */
  findByStatus(status: number): Promise<CashRequest[]>;

  /**
   * Encuentra solicitudes por tipo
   */
  findByType(type: number): Promise<CashRequest[]>;

  /**
   * Encuentra solicitudes por división
   */
  findByDivision(divisionId: number): Promise<CashRequest[]>;

  /**
   * Busca solicitudes por término
   */
  searchByTerm(term: string): Promise<CashRequest[]>;

  /**
   * Crea una nueva solicitud
   */
  create(cashRequestData: any): Promise<CashRequest>;

  /**
   * Actualiza una solicitud existente
   */
  update(id: number, cashRequestData: any): Promise<CashRequest>;

  // Métodos removidos - ahora se usa updateStatus para todas las acciones

  /**
   * Actualizar el estado de una solicitud (método genérico para admin)
   */
  updateStatus(
    id: number, 
    newStatus: number, 
    adminUserId: number, 
    action: string, 
    comment?: string, 
    actionDate?: Date
  ): Promise<CashRequest>;

  /**
   * Liquidar una solicitud
   */
  liquidate(id: number): Promise<CashRequest>;

  /**
   * Elimina una solicitud (soft delete)
   */
  delete(id: number): Promise<void>;

  /**
   * Restaura una solicitud eliminada
   */
  restore(id: number): Promise<CashRequest>;

  /**
   * Encuentra solicitudes eliminadas
   */
  findDeleted(): Promise<CashRequest[]>;

  /**
   * Obtiene estadísticas de solicitudes
   */
  getStats(): Promise<ICashRequestStats>;

  /**
   * Obtiene solicitudes por rango de fechas
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<CashRequest[]>;

  /**
   * Obtiene solicitudes por rango de montos
   */
  findByAmountRange(minAmount: number, maxAmount: number): Promise<CashRequest[]>;
} 