export interface IResponsableRepository {
    /**
     * Obtiene todos los responsables
     */
    findAll(): Promise<any[]>;
  
    /**
     * Obtiene un responsable por ID
     */
    findById(id: number): Promise<any>;
  }