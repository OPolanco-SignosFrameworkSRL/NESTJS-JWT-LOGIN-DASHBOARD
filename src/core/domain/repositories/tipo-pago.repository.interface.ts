export interface ITipoPagoRepository {
  /**
   * Obtiene todos los tipos de pago
   */
  findAll(): Promise<any[]>;

  /**
   * Obtiene un tipo de pago por ID
   */
  findById(id: number): Promise<any>;
}
