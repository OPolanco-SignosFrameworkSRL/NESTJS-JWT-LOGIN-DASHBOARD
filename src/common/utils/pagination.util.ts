import {
  IPaginationOptions,
  IPaginationResult,
} from '../interfaces/user.interface';
import { APP_CONSTANTS } from '../constants/app.constants';

export class PaginationUtil {
  static createPaginationOptions(
    page?: number,
    limit?: number,
  ): IPaginationOptions {
    const validPage = Math.max(
      1,
      page || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE,
    );
    const validLimit = Math.min(
      limit || APP_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      APP_CONSTANTS.PAGINATION.MAX_LIMIT,
    );

    return {
      page: validPage,
      limit: validLimit,
    };
  }

  static createPaginationResult<T>(
    data: T[],
    total: number,
    options: IPaginationOptions,
  ): IPaginationResult<T> {
    const totalPages = Math.ceil(total / options.limit);
    const hasNext = options.page < totalPages;
    const hasPrev = options.page > 1;

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  static getSkip(options: IPaginationOptions): number {
    return (options.page - 1) * options.limit;
  }

  static getTake(options: IPaginationOptions): number {
    return options.limit;
  }
}
