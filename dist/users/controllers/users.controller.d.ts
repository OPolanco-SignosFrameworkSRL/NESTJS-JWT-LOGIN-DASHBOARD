import { UsersService } from '../services/users.service';
import { AuthService } from '../../auth/services/auth.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RegisterDto } from '../../auth/dto/register.dto';
import { UserFiltersDto } from '../dto/user-filters.dto';
import { UserRole } from '../../common/interfaces/user.interface';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    create(registerDto: RegisterDto): Promise<{
        success: boolean;
        message?: string;
        error?: string;
        userId?: number;
    }>;
    findAll(filters: UserFiltersDto): Promise<import("../../common/interfaces/user.interface").IUserResponse[]>;
    getStats(): Promise<import("../../common/interfaces/user.interface").IUserStats>;
    searchByTerm(term: string): Promise<import("../../common/interfaces/user.interface").IUserResponse[]>;
    findByRole(role: UserRole): Promise<import("../../common/interfaces/user.interface").IUserResponse[]>;
    findByDivision(division: string): Promise<import("../../common/interfaces/user.interface").IUserResponse[]>;
    findOne(id: number): Promise<import("../../common/interfaces/user.interface").IUserResponse>;
    findByCedula(cedula: string): Promise<import("../../common/interfaces/user.interface").IUserResponse>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("../../common/interfaces/user.interface").IUserResponse>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
