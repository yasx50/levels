import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../auth/auth.js';

export interface AuthenticatedRequest extends Request {
  authUser: {
    id: string;
  };
}

@Injectable()
export class BetterAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session?.user.id) {
      throw new UnauthorizedException('Authentication required');
    }

    request.authUser = { id: session.user.id };
    return true;
  }
}
