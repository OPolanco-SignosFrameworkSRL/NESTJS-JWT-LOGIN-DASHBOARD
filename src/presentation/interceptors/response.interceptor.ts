import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ArgumentMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/* export interface Response<T> {
  Token: T;
  statusCode: number;
  message: string;
  timestamp: string;
} */

  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          // Si ya es una respuesta paginada, no envolver en el wrapper "Token"
          if (data && typeof data === 'object' && 'data' in data && 'total' in data && 'page' in data) {
            return {
              ...data,
              statusCode: 200,
              message: 'Operación exitosa',
              timestamp: new Date().toISOString(),
            };
          }
          return {
            Token: data,
            statusCode: 200,
            message: 'Operación exitosa',
            timestamp: new Date().toISOString(),
          };
        }),
      );
    }
  }


/* @Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((Token) => ({
        Token,
        statusCode: response.statusCode,
        message: 'Operación exitosa',
        timestamp: new Date().toISOString(),
      })), */
   