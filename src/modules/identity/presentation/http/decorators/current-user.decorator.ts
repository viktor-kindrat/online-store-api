import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UserRole } from '../../../domain/user-role.js';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();
    return request.user as AuthenticatedUser;
  },
);
