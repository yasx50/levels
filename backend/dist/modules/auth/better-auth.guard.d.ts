import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    authUser: {
        id: string;
    };
}
export declare class BetterAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
