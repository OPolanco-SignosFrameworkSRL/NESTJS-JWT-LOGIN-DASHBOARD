import { UserRole } from '../../common/interfaces/user.interface';
export declare class UserFiltersDto {
    role?: UserRole;
    division?: string;
    search?: string;
    active?: boolean;
}
