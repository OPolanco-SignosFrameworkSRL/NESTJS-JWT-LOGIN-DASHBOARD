export enum UserRole {
  Admin = 'Admin',
  Usuario = 'Usuario',
  Supervisor = 'Supervisor',
  Manager = 'Manager',
}

export interface IUser {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  fullname: string;
  role: number; // Cambiar de UserRole a number
  user_email: string;
  /*
  division: string;
  cargo: string;
  dependencia: string;
  recinto: string;
  estado: string; 
  */
  valido: string;
}

export interface IUserPayload {
  id: number;        // ID del usuario (alias de sub)
  cedula: string;
  apellido?: string;
  nombre?: string;
  sub: number;       // ID del usuario (JWT standard)
  fullname: string;
  rolesUsuario: Array<{ id: number; roleName: string }>; // Array de roles del usuario
  email: string;
  valido: boolean;   // true = activo, false = inactivo
}

export interface ILoginResponse {
  access_token: string;
  user: {
    id: number;
    cedula: string;
    fullname: string;
    apellido: string;
    rolesUsuario: Array<{ id: number; roleName: string }>; // Array de roles del usuario
    user_email: string;
    //division: string;
    //cargo: string;
    //dependencia: string;
    //recinto: string;
    valido: boolean;   // true = activo, false = inactivo
  };
  expires_in: number;
}

export interface IUserCreateData {
  cedula: string;
  nombre: string;
  apellido: string;
  fullname: string;
  password: string;
  clave: string;
  role?: number; // Cambiar de UserRole a number
  roles?: Array<{ id: number }>; // Array de roles para el usuario
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

export interface IUserUpdateData {
  nombre?: string;
  apellido?: string;
  role?: number; // Cambiar de UserRole a number
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
  valido?: string;
}

export interface IUserResponse {
  id?: number;
  nombre?: string;
  apellido?: string;
  fullname: string;
  cedula: string;
  roles: Array<{ id: number; roleName?: string }>; // Array de roles del usuario
  password?: string; // Contraseña hasheada (solo para endpoints específicos)
  //role?: string; // Rol principal para compatibilidad
  user_email: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  valido: boolean;   // true = activo, false = inactivo
}

/* export interface IUserIdResponse {
  id?: number;
  nombre: string; // Nombre completo combinado (nombre + apellido)
  apellido: string;
  fullname?: string;   
  cedula: string;
  roles: Array<{ id: number; roleName?: string }>; // Array de roles del usuario
  password?: string; // Contraseña hasheada (solo para endpoints específicos)
  //role?: string; // Rol principal para compatibilidad
  user_email: string;
  telefono?: string;
  celular?: string;
  direccion?: string;
  valido: boolean;   // true = activo, false = inactivo
} */

export interface IUserFilters {
  role?: number; // Cambiar de UserRole a number
  division?: string;
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  fullname?: string;
}

export interface IUserStats {
  totalUsers: number;
  usersByRole: any[];
  usersByDivision: any[];
} 