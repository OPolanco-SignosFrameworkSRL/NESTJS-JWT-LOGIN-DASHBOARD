import { CreateDesembolsoDto } from '../../application/dto/create-desembolso.dto';

export interface IDesembolsoService {
  /**
   * Crea un nuevo desembolso para una solicitud autorizada
   */
  createDesembolso(
    createDesembolsoDto: CreateDesembolsoDto,
    currentUser: { sub: number; role: string }
  ): Promise<any>;

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
}
