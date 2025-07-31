import { UserRole } from '../../common/interfaces/user.interface';
export declare class RegisterDto {
    cedula: string;
    nombre: string;
    apellido: string;
    password: string;
    clave: string;
    role?: UserRole;
    user_email?: string;
}
