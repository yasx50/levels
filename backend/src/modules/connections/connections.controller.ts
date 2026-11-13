import {
  Controller,
  Param,
  ParseUUIDPipe,
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
}
