import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import type { Env } from '../../../../infrastructure/config/env.schema.js';
import type { AuthTokens } from '../../application/ports/token-service.port.js';
import { toUserView, UserView } from '../../application/results/user-view.js';
import { AuthTokenIssuer } from '../../application/services/auth-token-issuer.js';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case.js';
import { RefreshSessionUseCase } from '../../application/use-cases/refresh-session.use-case.js';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import {
  ACCESS_TOKEN_COOKIE,
  CSRF_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from './cookie.constants.js';
import { CurrentUser, type AuthenticatedUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { LoginRequestDto } from './dto/login.request.dto.js';
import { RegisterRequestDto } from './dto/register.request.dto.js';

const ACCESS_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const CSRF_TOKEN_BYTES = 32;
const AUTH_RATE_LIMIT = { default: { limit: 10, ttl: 60000 } };

@Throttle(AUTH_RATE_LIMIT)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly refreshSession: RefreshSessionUseCase,
    private readonly logoutUser: LogoutUseCase,
    private readonly getCurrentUser: GetCurrentUserUseCase,
    private readonly tokenIssuer: AuthTokenIssuer,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserView> {
    const user = await this.registerUser.execute(dto);
    const tokens = await this.tokenIssuer.issue(user);
    this.setAuthCookies(response, tokens);
    return toUserView(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserView> {
    const result = await this.loginUser.execute(dto);
    this.setAuthCookies(response, result.tokens);
    return result.user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ status: string }> {
    const tokens = await this.refreshSession.execute({
      refreshToken: this.readRefreshToken(request) ?? '',
    });
    this.setAuthCookies(response, tokens);
    return { status: 'refreshed' };
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.logoutUser.execute({
      refreshToken: this.readRefreshToken(request),
    });
    response.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
    response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
    response.clearCookie(CSRF_TOKEN_COOKIE, { path: '/' });
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): Promise<UserView> {
    return this.getCurrentUser.execute(user.id);
  }

  @Public()
  @Get('csrf')
  csrf(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): { csrfToken: string } {
    const cookies = request.cookies as
      | Record<string, string | undefined>
      | undefined;
    const existing = cookies?.[CSRF_TOKEN_COOKIE];
    const csrfToken = existing ?? randomBytes(CSRF_TOKEN_BYTES).toString('hex');
    if (!existing) {
      this.setCsrfCookie(response, csrfToken);
    }
    return { csrfToken };
  }

  private readRefreshToken(request: Request): string | undefined {
    const cookies = request.cookies as
      | Record<string, string | undefined>
      | undefined;
    return cookies?.[REFRESH_TOKEN_COOKIE];
  }

  private setAuthCookies(response: Response, tokens: AuthTokens): void {
    const secure = this.config.get('NODE_ENV', { infer: true }) === 'production';
    const refreshMaxAge =
      this.config.get('REFRESH_TTL_DAYS', { infer: true }) *
      MILLISECONDS_PER_DAY;
    response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_COOKIE_MAX_AGE_MS,
    });
    response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: refreshMaxAge,
    });
    this.setCsrfCookie(response, randomBytes(CSRF_TOKEN_BYTES).toString('hex'));
  }

  private setCsrfCookie(response: Response, token: string): void {
    const secure = this.config.get('NODE_ENV', { infer: true }) === 'production';
    response.cookie(CSRF_TOKEN_COOKIE, token, {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge:
        this.config.get('REFRESH_TTL_DAYS', { infer: true }) *
        MILLISECONDS_PER_DAY,
    });
  }
}
