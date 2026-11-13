var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../auth/auth.js';
let BetterAuthGuard = class BetterAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(request.headers),
        });
        if (!session?.user.id) {
            throw new UnauthorizedException('Authentication required');
        }
        request.authUser = { id: session.user.id };
        return true;
    }
};
BetterAuthGuard = __decorate([
    Injectable()
], BetterAuthGuard);
export { BetterAuthGuard };
//# sourceMappingURL=better-auth.guard.js.map