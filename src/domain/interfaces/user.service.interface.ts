import { IUserResponse, IUserUpdateData, IUserFilters, IUserStats } from './user.interface';
import { UserRole } from './user.interface';

export interface IUserService {
  findAll(filters?: IUserFilters): Promise<IUserResponse[]>;
  findOne(id: number): Promise<IUserResponse>;
  findByCedula(cedula: string): Promise<IUserResponse>;
  update(
    id: number,
    updateData: IUserUpdateData,
    currentUser?: { id: number; role: UserRole },
  ): Promise<IUserResponse>;
  remove(id: number): Promise<void>;
  searchByTerm(term: string): Promise<IUserResponse[]>;
  findByRole(role: UserRole): Promise<IUserResponse[]>;
  findByDivision(division: string): Promise<IUserResponse[]>;
  getStats(): Promise<IUserStats>;
  exists(cedula: string): Promise<boolean>;
  updateUserPhone(
    cedula: string,
    clave: string,
    telefono: string,
  ): Promise<{ success: boolean; message: string; user?: any }>;
} 