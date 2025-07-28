import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        cedula: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    getProfile(req: any): Promise<{
        message: string;
        user: any;
    }>;
    checkUser(req: any): Promise<any>;
    test(): {
        message: string;
        timestamp: string;
        endpoints: string[];
    };
}
