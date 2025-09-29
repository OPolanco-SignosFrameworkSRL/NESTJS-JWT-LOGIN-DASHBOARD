export interface ITipoPagoRepository {
  /**
   * Obtiene todos los tipos de pago
   */
  findAll(statusId?: number, search?: string): Promise<any[]>;

  /**
   * Obtiene un tipo de pago por ID
   */
  findById(id: number): Promise<any>;

  /**
   * Obtiene paginado con filtros
   */
  findAllPaginated(skip: number, take: number, statusId?: number, search?: string): Promise<[any[], number]>;

  /** Crear, actualizar y eliminación lógica */
  create(data: { tipo_desc: string; estado?: number }): Promise<any>;
  update(id: number, data: { tipo_desc?: string; estado?: number }): Promise<any>;
  softDelete(id: number): Promise<any>;
  existsByDescripcion(descripcion: string): Promise<boolean>;
}
