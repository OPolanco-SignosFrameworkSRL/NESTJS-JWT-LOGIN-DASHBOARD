import { CreateDesembolsoDto } from '../../application/dto/create-desembolso.dto';

export interface IDesembolsoRepository {
  /**
   * Crea un nuevo desembolso
   */
  create(createDesembolsoDto: CreateDesembolsoDto & { numero_desembolso: string; registrado_por_id: number; estado: string }): Promise<any>;

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
}
