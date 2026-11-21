import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import {
  ACCESS_TOKEN_COOKIE,
  CSRF_HEADER,
  CSRF_TOKEN_COOKIE,
} from '../cookie.constants.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const BEARER_PREFIX = 'Bearer ';

type CsrfRequest = Request & {
  cookies?: Record<string, string | undefined>;
};

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<CsrfRequest>();
    if (SAFE_METHODS.has(request.method)) {
      return true;
    }
    if (request.headers.authorization?.startsWith(BEARER_PREFIX)) {
      return true;
    }
    const cookies = request.cookies ?? {};
    if (!cookies[ACCESS_TOKEN_COOKIE]) {
      return true;
    }
    const cookieToken = cookies[CSRF_TOKEN_COOKIE];
    const headerToken = request.headers[CSRF_HEADER];
    if (
      !cookieToken ||
      typeof headerToken !== 'string' ||
      headerToken !== cookieToken
    ) {
      throw new ForbiddenException('Invalid CSRF token');
    }
    return true;
  }
}
