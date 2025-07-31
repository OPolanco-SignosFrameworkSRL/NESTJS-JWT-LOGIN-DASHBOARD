import { IPaginationOptions, IPaginationResult } from '../interfaces/user.interface';
export declare class PaginationUtil {
    static createPaginationOptions(page?: number, limit?: number): IPaginationOptions;
    static createPaginationResult<T>(data: T[], total: number, options: IPaginationOptions): IPaginationResult<T>;
    static getSkip(options: IPaginationOptions): number;
    static getTake(options: IPaginationOptions): number;
}
