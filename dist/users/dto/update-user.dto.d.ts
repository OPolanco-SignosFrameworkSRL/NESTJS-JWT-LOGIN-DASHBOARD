import { UserRole } from '../../common/interfaces/user.interface';
export declare class UpdateUserDto {
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
