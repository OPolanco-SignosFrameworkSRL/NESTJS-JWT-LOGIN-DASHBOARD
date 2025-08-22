import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      error = exception.getResponse();
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.stack;
    }

    // Log del error para depuración
    this.logger.error(`Error en ${request.method} ${request.url}:`, {
      status,
      message,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString(),
    });

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    };

    response.status(status).json(errorResponse);
  }
} 