import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: Partial<User>;
    }>;
    validateUser(email: string, password: string): Promise<Partial<User> | null>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: Partial<User>;
    }>;
    findById(id: number): Promise<Partial<User> | null>;
    findByEmail(email: string): Promise<Partial<User> | null>;
    updatePassword(userId: number, newPassword: string): Promise<{
        message: string;
    }>;
    deactivateUser(userId: number): Promise<{
        message: string;
    }>;
    findAllUsers(): Promise<Partial<User>[]>;
}
