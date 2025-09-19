import { CreateDesembolsoDto } from '../../application/dto/create-desembolso.dto';

export interface IDesembolsoRepository {
  /**
   * Crea un nuevo desembolso
   */
  create(createDesembolsoDto: CreateDesembolsoDto & { numDesembolso: string }): Promise<any>;

  /**
   * Obtiene todos los desembolsos
   */
  findAll(): Promise<any[]>;

  /**
   * Obtiene un desembolso por ID
   */
  findById(id: number): Promise<any>;

  /**
   * Obtiene desembolsos por solicitud
   */
  findBySolicitud(solicitudId: number): Promise<any[]>;

  /**
   * Obtiene desembolsos por responsable
   */
  findByResponsable(responsableId: number): Promise<any[]>;

  /**
   * Obtiene el último desembolso del mes para generar secuencia
   */
  findLastByMonth(year: number, month: string): Promise<any>;

  /**
   * Actualiza un desembolso
   */
  update(id: number, updateData: any): Promise<any>;

  /**
   * Elimina un desembolso (soft delete)
   */
  delete(id: number): Promise<void>;

  findAllWithPagination(filters?: any & { skip?: number; take?: number }): Promise<[any[], number]>;

  /**
   * Obtiene una solicitud de efectivo por ID usando relaciones
   */
  findSolicitudById(solicitudId: number): Promise<any>;

  /**
   * Actualiza el estado de una solicitud de efectivo
   */
  updateSolicitudStatus(solicitudId: number, newStatus: number): Promise<void>;

  /**
   * Ejecuta una consulta SQL directa
   */
  query(sql: string, parameters?: any[]): Promise<any>;
}
