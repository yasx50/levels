import type { AuthenticatedRequest } from '../auth/better-auth.guard.js';
import { ConnectionsService } from './connections.service.js';
export declare class ConnectionsController {
    private readonly connectionsService;
    constructor(connectionsService: ConnectionsService);
    sendRequest(recipientId: string, request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            requesterId: string;
            recipientId: string;
            status: import("@prisma/client").$Enums.ConnectionStatus;
            createdAt: Date;
        };
    }>;
}
