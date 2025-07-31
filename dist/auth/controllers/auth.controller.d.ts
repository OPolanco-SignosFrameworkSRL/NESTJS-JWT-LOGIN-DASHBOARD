import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ILoginResponse } from '../../common/interfaces/user.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<ILoginResponse>;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message?: string;
        error?: string;
        userId?: number;
    }>;
    checkUserInfo(cedula: string): Promise<any>;
    verifyToken(req: any): Promise<{
        valid: boolean;
        user: any;
        message: string;
    }>;
}
