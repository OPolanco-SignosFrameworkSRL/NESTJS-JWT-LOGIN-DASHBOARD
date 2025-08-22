/**
 * Roles de usuario en el sistema
 */
export type UserRole = 'Admin' | 'Usuario' | 'Supervisor' | 'Manager' | 'Administrator';

/**
 * Interfaz para la respuesta de usuario
 */
export interface IUserResponse {
  id: number;
  cedula: string;
  nombre?: string;  // Hacer opcional
  apellido?: string; // Hacer opcional
  fullname?: string;
  role: UserRole;
  user_email?: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  valido: boolean;
  division?: string;
  cargo?: string;
  dependencia?: string;
  recinto?: string;
  estado?: string;
}

/**
 * Interfaz para datos de creación de usuario
 */
export interface IUserCreateData {
  cedula: string;
  nombre: string;
  apellido: string;
  fullname: string;
  password: string;
  clave: string;
  role?: UserRole;
  user_email?: string;
  telefono?: string;
  direccion?: string;
  celular?: string;
  user_status?: number;
  caja_id?: string;
  tienda_id?: string;
  allow_multi_tienda?: string;
  max_descuento?: string;
  close_caja?: string;
  user_account_email?: string;
  user_account_email_passw?: string;
  comision_porciento?: string;
  default_portalid?: string;
  nuevocampo?: string;
  encargadoId?: string;
}

/**
 * Interfaz para datos de actualización de usuario
 */
export interface IUserUpdateData {
  nombre?: string;
  apellido?: string;
  //role?: UserRole;
  cedula?: string;
  password?: string; // Campo opcional para contraseña
  role?: string;
  user_email?: string;
  telefono?: string;
  direccion?: string;
  celular?: string;
  /* 
  division?: string;
  cargo?: string;
  dependencia?: string;
  recinto?: string;
  */
  estado?: string; 
}

/**
 * Interfaz para filtros de usuario
 */
export interface IUserFilters {
  role?: UserRole;
  division?: string;
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Interfaz para estadísticas de usuarios
 */
export interface IUserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<UserRole, number>;
  byDivision: Record<string, number>;
}

/**
 * Interfaz para el payload JWT del usuario
 */
export interface IUserPayload {
  username: string;
  sub: number;
  fullname: string;
  role: UserRole;
  email?: string;
}

/**
 * Interfaz para el usuario en el contexto de autenticación
 */
export interface IUser {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  fullname: string;
  role: UserRole;
  user_email?: string;
  telefono?: string;
  valido: boolean;
  division?: string;
  cargo?: string;
  dependencia?: string;
  recinto?: string;
  estado?: string;
}

/**
 * Interfaz para la respuesta de login
 */
export interface ILoginResponse {
  access_token: string;
  user: IUser;
  expires_in: number;
}
