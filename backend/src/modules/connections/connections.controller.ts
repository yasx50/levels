import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BetterAuthGuard } from '../auth/better-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/better-auth.guard.js';
import { ConnectionsService } from './connections.service.js';

@Controller('connections')
@UseGuards(BetterAuthGuard)
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post(':userId/request')
  sendRequest(
    @Param('userId', ParseUUIDPipe) recipientId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.connectionsService.sendRequest(
      request.authUser.id,
      recipientId,
    );
  }

  @Get('requests/received')
  getReceivedRequests(@Req() request: AuthenticatedRequest) {
    return this.connectionsService.getReceivedRequests(request.authUser.id);
  }

  @Get('requests/sent')
  getSentRequests(@Req() request: AuthenticatedRequest) {
    return this.connectionsService.getSentRequests(request.authUser.id);
  }

  @Patch(':id/accept')
  acceptRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.connectionsService.acceptRequest(id, request.authUser.id);
  }

  @Patch(':id/reject')
  rejectRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.connectionsService.rejectRequest(id, request.authUser.id);
  }
}
