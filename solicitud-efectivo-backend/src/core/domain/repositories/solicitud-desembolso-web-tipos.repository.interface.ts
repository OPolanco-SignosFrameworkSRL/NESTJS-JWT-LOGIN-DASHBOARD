export interface ISolicitudDesembolsoWebTiposRepository {
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
}
