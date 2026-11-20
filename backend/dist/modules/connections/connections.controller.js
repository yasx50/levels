var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards, Req, } from '@nestjs/common';
import { BetterAuthGuard } from '../auth/better-auth.guard.js';
import { ConnectionsService } from './connections.service.js';
let ConnectionsController = class ConnectionsController {
    connectionsService;
    constructor(connectionsService) {
        this.connectionsService = connectionsService;
    }
    sendRequest(recipientId, request) {
        return this.connectionsService.sendRequest(request.authUser.id, recipientId);
    }
    getReceivedRequests(request) {
        return this.connectionsService.getReceivedRequests(request.authUser.id);
    }
    getSentRequests(request) {
        return this.connectionsService.getSentRequests(request.authUser.id);
    }
    acceptRequest(id, request) {
        return this.connectionsService.acceptRequest(id, request.authUser.id);
    }
    rejectRequest(id, request) {
        return this.connectionsService.rejectRequest(id, request.authUser.id);
    }
};
__decorate([
    Post(':userId/request'),
    __param(0, Param('userId', ParseUUIDPipe)),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "sendRequest", null);
__decorate([
    Get('requests/received'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "getReceivedRequests", null);
__decorate([
    Get('requests/sent'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "getSentRequests", null);
__decorate([
    Patch(':id/accept'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "acceptRequest", null);
__decorate([
    Patch(':id/reject'),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "rejectRequest", null);
ConnectionsController = __decorate([
    Controller('connections'),
    UseGuards(BetterAuthGuard),
    __metadata("design:paramtypes", [ConnectionsService])
], ConnectionsController);
export { ConnectionsController };
//# sourceMappingURL=connections.controller.js.map