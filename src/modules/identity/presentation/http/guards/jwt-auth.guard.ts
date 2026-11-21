import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import {
  TOKEN_SERVICE,
  type TokenService,
} from '../../../application/ports/token-service.port.js';
import type { AuthenticatedUser } from '../decorators/current-user.decorator.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { ACCESS_TOKEN_COOKIE } from '../cookie.constants.js';

const BEARER_PREFIX = 'Bearer ';

type RequestWithUser = Request & {
  user?: AuthenticatedUser;
  cookies?: Record<string, string | undefined>;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.tokens.verifyAccessToken(token);
      request.user = { id: payload.sub, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: RequestWithUser): string | undefined {
    const fromCookie = request.cookies?.[ACCESS_TOKEN_COOKIE];
    if (fromCookie) {
      return fromCookie;
    }
    const header = request.headers.authorization;
    if (header?.startsWith(BEARER_PREFIX)) {
      return header.slice(BEARER_PREFIX.length);
    }
    return undefined;
  }
}
