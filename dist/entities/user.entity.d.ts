export declare class User {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    codigo: string;
    role: string;
    user_email: string;
    valido: boolean;
    division: string;
    cargo: string;
    dependencia: string;
    recinto: string;
    estado: string;
    getFullName(): string;
    getApellido(): string;
    isActive(): boolean;
    hasRole(role: string): boolean;
}
