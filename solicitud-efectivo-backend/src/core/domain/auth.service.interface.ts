import { IUser, IUserCreateData, ILoginResponse, IUserPayload } from './user.interface';

export interface IAuthService {
  validateUser(cedula: string, password: string): Promise<IUser | null>;
  createUser(data: IUserCreateData): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    userId?: number;
  }>;
  login(user: IUser): Promise<ILoginResponse>;
  verifyToken(token: string): Promise<IUserPayload>;
  updateUserPhone(cedula: string, clave: string, telefono: string): Promise<{
    success: boolean;
    message: string;
    user?: any;
  }>;
} 