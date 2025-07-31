// Asume que este es el contenido existente de tu archivo user.interface.ts
// Solo se muestra la interfaz IUserCreateData para el cambio relevante.

// Enum para los roles de usuario
export enum UserRole {
  Admin = 'Admin',
  Usuario = 'Usuario',
  Supervisor = 'Supervisor',
  Manager = 'Manager',
}

// Interfaz para los datos de usuario que se devuelven después de la autenticación
export interface IUser {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  fullname: string;
  role: UserRole;
  user_email?: string;
  division?: string;
  cargo?: string;
  dependencia?: string;
  recinto?: string;
  estado?: string;
  valido: boolean;
}

// Interfaz para el payload del token JWT
export interface IUserPayload {
  username: string; // Cedula del usuario
  sub: number; // ID del usuario
  fullname: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface IUserResponse {
  id: number;
  cedula: string;
  fullname: string;
  apellido: string;
  role: UserRole;
  user_email?: string;
  division?: string;
  cargo?: string;
  dependencia?: string;
  recinto?: string;
  estado?: string;
}

// Interfaz para la respuesta de login
export interface ILoginResponse {
  access_token: string;
  user: IUserResponse;
  expires_in: number; // Tiempo de expiración del token en segundos
}

export interface IUserStats {
  totalUsers: number;
  usersByRole: Array<{ role: string; count: number }>;
  usersByDivision: Array<{ division: string; count: number }>;
}

export interface IUserFilters {
  role?: UserRole;
  division?: string;
  search?: string;
  active?: boolean;
}

// Interfaz para los datos necesarios para crear un nuevo usuario
export interface IUserCreateData {
  cedula: string;
  nombre: string;
  apellido: string;
  password: string;
  clave: string; // ¡Asegúrate de que esta línea esté presente!
  role?: UserRole;
  user_email?: string;
  division?: string;
  cargo?: string;
  dependencia?: string;
  recinto?: string;
  estado?: string;
}

export interface IUserUpdateData {
  nombre?: string;
  apellido?: string;
  role?: UserRole;
  user_email?: string;
  division?: string;
  cargo?: string;
  dependencia?: string;
  recinto?: string;
  estado?: string;
  valido?: boolean;
}

export interface IApiResponse<T = any> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}