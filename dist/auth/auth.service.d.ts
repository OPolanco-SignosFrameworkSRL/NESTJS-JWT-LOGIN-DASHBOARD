import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService implements OnModuleInit, OnModuleDestroy {
    private readonly jwtService;
    private pool;
    constructor(jwtService: JwtService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    validateUser(cedula: string, password: string): Promise<any>;
    private decryptPassword;
    login(loginDto: {
        cedula: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    checkUserInfo(cedula: string): Promise<any>;
}
