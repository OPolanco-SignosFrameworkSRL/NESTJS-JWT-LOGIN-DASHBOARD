import { User } from '../entities/user.entity';
import { UserWrite } from '../entities/user-write.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByCedula(cedula: string): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
  findByDivision(division: string): Promise<User[]>;
  searchByTerm(term: string): Promise<User[]>;
  getStats(): Promise<any>;
  exists(cedula: string): Promise<boolean>;
}

export interface IUserWriteRepository {
  findById(id: number): Promise<UserWrite | null>;
  findByCedula(cedula: string): Promise<UserWrite | null>;
  create(userData: Partial<UserWrite>): Promise<UserWrite>;
  update(id: number, userData: Partial<UserWrite>): Promise<UserWrite>;
  delete(id: number): Promise<void>;
  findAll(): Promise<UserWrite[]>;
  findByValido(valido: string): Promise<UserWrite[]>;
} 