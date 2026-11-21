import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainError, type DomainErrorKind } from '../domain/domain-error.js';

const KIND_STATUS: Record<DomainErrorKind, number> = {
  conflict: HttpStatus.CONFLICT,
  not_found: HttpStatus.NOT_FOUND,
  unauthorized: HttpStatus.UNAUTHORIZED,
  forbidden: HttpStatus.FORBIDDEN,
  validation: HttpStatus.BAD_REQUEST,
  unprocessable: HttpStatus.UNPROCESSABLE_ENTITY,
};

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code: string;
  instance: string;
}

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const problem = this.toProblem(exception, request.url);
    response.status(problem.status).json(problem);
  }

  private toProblem(exception: unknown, instance: string): ProblemDetails {
    if (exception instanceof DomainError) {
      return {
        type: 'about:blank',
        title: exception.message,
        status: KIND_STATUS[exception.kind],
        code: exception.code,
        instance,
      };
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const title = this.extractTitle(payload, exception.message);
      return {
        type: 'about:blank',
        title,
        status,
        code: HttpStatus[status] ?? 'ERROR',
        instance,
      };
    }
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'status' in exception &&
      typeof (exception as { status: unknown }).status === 'number'
    ) {
      const status = (exception as { status: number }).status;
      return {
        type: 'about:blank',
        title: HttpStatus[status] ?? 'Error',
        status,
        code: HttpStatus[status] ?? 'ERROR',
        instance,
      };
    }
    this.logger.error(exception);
    return {
      type: 'about:blank',
      title: 'Internal server error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      instance,
    };
  }

  private extractTitle(payload: string | object, fallback: string): string {
    if (typeof payload === 'string') {
      return payload;
    }
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message)) {
      return message.map((item) => String(item)).join(', ');
    }
    return fallback;
  }
}
