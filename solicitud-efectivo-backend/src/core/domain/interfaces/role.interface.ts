import { Role } from '../entities/role.entity';

/**
 * Interface para filtros de búsqueda de roles
 */
export interface IRoleFilters {
  role_name?: string;
  role_desc?: string;
  search?: string; // Búsqueda general por nombre o descripción
  page?: number;
  limit?: number;
  statusId?: number;
}

/**
 * Interface para datos de creación de rol
 */
export interface ICreateRoleData {
  role_name: string;
  role_desc?: string;
  valido?: boolean;
}

/**
 * Interface para datos de actualización de rol
 */
export interface IUpdateRoleData {
  role_name?: string;
  role_desc?: string;
  statusId?: number;
}

/**
 * Interface para respuesta paginada de roles
 */
export interface IRolePaginatedResponse {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number; hasNext: boolean; hasPrev: boolean;
}

/**
 * Interface para estadísticas de roles
 */
export interface IRoleStats {
  totalRoles: number;
  activeRoles: number;
  inactiveRoles: number;
  administrativeRoles: number;
  operationalRoles: number;
}

/**
 * Enum para los nombres de roles del sistema
 */
export enum RoleName {
  ADMINISTRATOR = 'Administrador',
  SUPERVISOR = 'Supervisor',
  CASHIER = 'Auxiliar de caja',
  OPERATOR = 'Operador',
}

/**
 * Type para los valores de roles permitidos
 */
export type RoleType = keyof typeof RoleName;
