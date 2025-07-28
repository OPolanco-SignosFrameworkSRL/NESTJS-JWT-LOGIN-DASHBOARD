import { AuthService } from './auth.service.new';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: Partial<User>;
    }>;
    getProfile(req: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: Partial<User>;
    }>;
    getCurrentUser(req: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: Partial<User>;
    }>;
    validateCredentials(loginDto: LoginDto): Promise<{
        valid: boolean;
        message: string;
        user?: undefined;
    } | {
        valid: boolean;
        message: string;
        user: Partial<User>;
    }>;
    test(): {
        message: string;
        timestamp: string;
        endpoints: string[];
    };
}
