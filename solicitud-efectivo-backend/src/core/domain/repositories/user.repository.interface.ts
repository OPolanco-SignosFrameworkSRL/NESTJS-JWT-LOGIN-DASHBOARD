import { User } from '../entities/user.entity';
import { IUserFilters, IUserStats } from '../interfaces/user.interface';

/**
 * Interfaz del repositorio de usuarios
 * Define los contratos para el acceso a datos de usuarios
 * Sigue el principio de inversión de dependencias
 */
export interface IUserRepository {
  /**
   * Encuentra todos los usuarios con filtros opcionales
   */
  findAll(filters?: IUserFilters): Promise<User[]>;

  /**
   * Encuentra un usuario por ID
   */
  findById(id: number): Promise<User | null>;

  /**
   * Encuentra un usuario por cédula
   */
  findByCedula(cedula: string): Promise<User | null>;

  /**
   * Encuentra usuarios por rol
   */
  findByRole(roleId: number): Promise<User[]>;

  /**
   * Encuentra usuarios por división
   */
  findByDivision(division: string): Promise<User[]>;

  /**
   * Busca usuarios por término
   */
  searchByTerm(term: string): Promise<User[]>;

  /**
   * Crea un nuevo usuario
   */
  create(userData: any): Promise<User>;

  /**
   * Actualiza un usuario existente
   */
  update(id: number, userData: any): Promise<User>;

  /**
   * Elimina un usuario (soft delete)
   */
  delete(id: number): Promise<void>;

  /**
   * Restaura un usuario eliminado
   */
  restore(id: number): Promise<User>;

  /**
   * Encuentra usuarios eliminados
   */
  findDeleted(): Promise<User[]>;

  /**
   * Verifica si existe un usuario con la cédula dada
   */
  exists(cedula: string): Promise<boolean>;

  /**
   * Obtiene estadísticas de usuarios
   */
  getStats(): Promise<IUserStats>;

  /**
   * Actualiza el teléfono de un usuario
   */
  updatePhone(cedula: string, telefono: string): Promise<User>;

  /**
   * Valida las credenciales de un usuario (cédula y contraseña hasheada)
   */
  validateCredentials(cedula: string, hashedPassword: string): Promise<boolean>;
} 