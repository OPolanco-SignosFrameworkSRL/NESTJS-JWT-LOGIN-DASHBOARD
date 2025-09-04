import { CreateDivisionDto } from '../../application/dto/create-division.dto';
import { UpdateDivisionDto } from '../../application/dto/update-division.dto';

export interface IDivisionRepository {
  /**
   * Crea una nueva división
   */
  create(createDivisionDto: CreateDivisionDto): Promise<any>;

  /**
   * Obtiene todas las divisiones
   */
  findAll(): Promise<any[]>;

  /**
   * Obtiene una división por ID
   */
  findById(id: number): Promise<any>;

  /**
   * Actualiza una división
   */
  update(id: number, updateDivisionDto: UpdateDivisionDto): Promise<any>;

  /**
   * Elimina una división
   */
  delete(id: number): Promise<void>;

  /**
   * Busca divisiones por nombre
   */
  findByName(nombre: string): Promise<any[]>;

  /**
   * Busca divisiones por dependencia
   */
  findByDependencia(dependenciaId: number): Promise<any[]>;
}
