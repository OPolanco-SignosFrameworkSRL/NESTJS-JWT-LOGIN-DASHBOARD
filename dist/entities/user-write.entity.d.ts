export declare class UserWrite {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    codigo: string;
    password: string;
    role: string;
    user_email: string;
    valido: boolean;
    getFullName(): string;
    getApellido(): string;
    isActive(): boolean;
    hasRole(role: string): boolean;
}
