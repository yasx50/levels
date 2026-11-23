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
    getReceivedRequests(request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ConnectionStatus;
            requesterId: string;
            recipientId: string;
            respondedAt: Date | null;
            requester: {
                id: string;
                name: string;
                image: string | null;
                field: string | null;
                role: string | null;
                avatarUrl: string | null;
            };
        }[];
    }>;
    getSentRequests(request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ConnectionStatus;
            recipient: {
                id: string;
                name: string;
                image: string | null;
                field: string | null;
                role: string | null;
                avatarUrl: string | null;
            };
            requesterId: string;
            recipientId: string;
            respondedAt: Date | null;
        }[];
    }>;
    acceptRequest(id: string, request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ConnectionStatus;
            requesterId: string;
            recipientId: string;
            respondedAt: Date | null;
        };
    }>;
    rejectRequest(id: string, request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ConnectionStatus;
            requesterId: string;
            recipientId: string;
            respondedAt: Date | null;
        };
    }>;
}
