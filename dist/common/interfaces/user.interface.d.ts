export declare enum UserRole {
    Admin = "Admin",
    Usuario = "Usuario",
    Supervisor = "Supervisor",
    Manager = "Manager"
}
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
export interface IUserPayload {
    username: string;
    sub: number;
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
export interface ILoginResponse {
    access_token: string;
    user: IUserResponse;
    expires_in: number;
}
export interface IUserStats {
    totalUsers: number;
    usersByRole: Array<{
        role: string;
        count: number;
    }>;
    usersByDivision: Array<{
        division: string;
        count: number;
    }>;
}
export interface IUserFilters {
    role?: UserRole;
    division?: string;
    search?: string;
    active?: boolean;
}
export interface IUserCreateData {
    cedula: string;
    nombre: string;
    apellido: string;
    password: string;
    clave: string;
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
