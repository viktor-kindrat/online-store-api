import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Env } from '../../infrastructure/config/env.schema.js';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port.js';
import { REFRESH_SESSION_REPOSITORY } from './application/ports/refresh-session.repository.port.js';
import { TOKEN_SERVICE } from './application/ports/token-service.port.js';
import { USER_ACCOUNT_REPOSITORY } from './application/ports/user-account.repository.port.js';
import { AuthTokenIssuer } from './application/services/auth-token-issuer.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { LogoutUseCase } from './application/use-cases/logout.use-case.js';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { RefreshSessionOrmEntity } from './infrastructure/persistence/refresh-session.orm-entity.js';
import { TypeOrmRefreshSessionRepository } from './infrastructure/persistence/typeorm-refresh-session.repository.js';
import { TypeOrmUserAccountRepository } from './infrastructure/persistence/typeorm-user-account.repository.js';
import { UserAccountOrmEntity } from './infrastructure/persistence/user-account.orm-entity.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.js';
import { JwtTokenService } from './infrastructure/security/jwt-token.service.js';
import { AuthController } from './presentation/http/auth.controller.js';
import { CsrfGuard } from './presentation/http/guards/csrf.guard.js';
import { JwtAuthGuard } from './presentation/http/guards/jwt-auth.guard.js';
import { RolesGuard } from './presentation/http/guards/roles.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccountOrmEntity, RefreshSessionOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        secret: config.get('JWT_ACCESS_SECRET', { infer: true }),
        signOptions: { expiresIn: config.get('JWT_ACCESS_TTL', { infer: true }) },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUseCase,
    RefreshSessionUseCase,
    LogoutUseCase,
    AuthTokenIssuer,
    { provide: USER_ACCOUNT_REPOSITORY, useClass: TypeOrmUserAccountRepository },
    {
      provide: REFRESH_SESSION_REPOSITORY,
      useClass: TypeOrmRefreshSessionRepository,
    },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
  ],
})
export class IdentityModule {}
