import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    
    return next.handle().pipe(
      map((data) => {
        // Si ya tiene el formato esperado con statusCode, timestamp y message, no lo modificamos
        if (data && typeof data === 'object' && 'statusCode' in data && 'timestamp' in data && 'message' in data) {
          return data;
        }

        // Para respuestas paginadas, mantener la estructura pero agregar campos faltantes
        if (data && typeof data === 'object' && 'data' in data && 'total' in data && 'page' in data) {
          return {
            ...data,
            statusCode: response.statusCode || 200,
            message: 'Operación exitosa',
            timestamp: new Date().toISOString(),
          };
        }

        // Envolver cualquier otra respuesta en el formato estándar con "data"
        return {
          data,
          statusCode: response.statusCode || 200,
          timestamp: new Date().toISOString(),
          message: 'Operación exitosa',
        };
      }),
    );
  }
}

   