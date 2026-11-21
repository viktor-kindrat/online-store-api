import {
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { type Observable, mergeMap, of } from 'rxjs';
import { IdempotencyConflictError } from './idempotency-conflict.error.js';
import {
  IDEMPOTENCY_STORE,
  type IdempotencyStore,
} from './idempotency.store.js';

const IDEMPOTENCY_HEADER = 'idempotency-key';
const HTTP_OK_MIN = 200;
const HTTP_OK_MAX = 300;

type RequestWithUser = Request & { user?: { id: string } };

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    @Inject(IDEMPOTENCY_STORE) private readonly store: IdempotencyStore,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const headerValue = request.headers[IDEMPOTENCY_HEADER];
    const key = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const owner = request.user;
    if (!key || !owner) {
      return next.handle();
    }

    const fingerprint = this.fingerprint(request);
    const existing = await this.store.find(key, owner.id);
    if (existing) {
      if (existing.requestFingerprint !== fingerprint) {
        throw new IdempotencyConflictError();
      }
      context.switchToHttp().getResponse<Response>().status(existing.responseStatus);
      return of(existing.responseBody);
    }

    return next.handle().pipe(
      mergeMap(async (body: unknown) => {
        const status = context
          .switchToHttp()
          .getResponse<Response>().statusCode;
        if (status >= HTTP_OK_MIN && status < HTTP_OK_MAX) {
          await this.store.save({
            key,
            ownerId: owner.id,
            requestFingerprint: fingerprint,
            responseStatus: status,
            responseBody: body,
          });
        }
        return body;
      }),
    );
  }

  private fingerprint(request: RequestWithUser): string {
    const payload = `${request.method}\n${request.originalUrl}\n${JSON.stringify(
      (request.body as unknown) ?? {},
    )}`;
    return createHash('sha256').update(payload).digest('hex');
  }
}
