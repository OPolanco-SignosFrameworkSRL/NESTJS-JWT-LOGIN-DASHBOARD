import { JwtService } from '@nestjs/jwt';
import { Repository, DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserWrite } from '../../entities/user-write.entity';
import { IUser, IUserPayload, ILoginResponse, IUserCreateData } from '../../common/interfaces/user.interface';
import { CryptoService } from '../../common/services/crypto.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly jwtService;
    private readonly cryptoService;
    private readonly configService;
    private readonly userRepository;
    private readonly userWriteRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(jwtService: JwtService, cryptoService: CryptoService, configService: ConfigService, userRepository: Repository<User>, userWriteRepository: Repository<UserWrite>, dataSource: DataSource);
    validateUser(cedula: string, password: string): Promise<IUser | null>;
    createUser(data: IUserCreateData): Promise<{
        success: boolean;
        message?: string;
        error?: string;
        userId?: number;
    }>;
    login(user: IUser): Promise<ILoginResponse>;
    checkUserInfo(cedula: string): Promise<any>;
    verifyToken(token: string): Promise<IUserPayload>;
    private parseExpiresIn;
}
