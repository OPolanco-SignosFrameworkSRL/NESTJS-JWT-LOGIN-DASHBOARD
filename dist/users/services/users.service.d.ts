import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserResponse, IUserStats, IUserFilters, IUserUpdateData, UserRole } from '../../common/interfaces/user.interface';
export declare class UsersService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>);
    findAll(filters?: IUserFilters): Promise<IUserResponse[]>;
    findOne(id: number): Promise<IUserResponse>;
    findByCedula(cedula: string): Promise<IUserResponse>;
    update(_id: number, _updateData: IUserUpdateData): Promise<IUserResponse>;
    remove(_id: number): Promise<void>;
    searchByTerm(term: string): Promise<IUserResponse[]>;
    findByRole(role: UserRole): Promise<IUserResponse[]>;
    findByDivision(division: string): Promise<IUserResponse[]>;
    getStats(): Promise<IUserStats>;
    exists(cedula: string): Promise<boolean>;
    private createQueryBuilder;
    private mapToUserResponse;
}
