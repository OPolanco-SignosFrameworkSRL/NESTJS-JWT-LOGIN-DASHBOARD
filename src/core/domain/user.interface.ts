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
  role: UserRole;
  user_email: string;
  
  division: string;
  cargo: string;
  dependencia: string;
  recinto: string;
  estado: string; 
  
  valido: string;
}

export interface IUserPayload {
  id: number;        // ID del usuario (alias de sub)
  cedula: string;
  sub: number;       // ID del usuario (JWT standard)
  fullname: string;
  role: UserRole;
  email: string;  // ← Agregar esta línea
  valido: string;
}

export interface ILoginResponse {
  access_token: string;
  user: {
    id: number;
    cedula: string;
    fullname: string;
    apellido: string;
    role: UserRole;
    user_email: string;
    //division: string;
    //cargo: string;
    //dependencia: string;
    //recinto: string;
    valido: string;
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

export interface IUserUpdateData {
  nombre?: string;
  apellido?: string;
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
  valido?: string;
}

export interface IUserResponse {
  id: number;
  cedula: string;
  fullname: string;
  role: UserRole;
  user_email: string;
  valido: string;
}

export interface IUserFilters {
  role?: UserRole;
  division?: string;
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface IUserStats {
  totalUsers: number;
  usersByRole: any[];
  usersByDivision: any[];
}  