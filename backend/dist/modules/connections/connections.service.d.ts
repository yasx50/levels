import { PrismaService } from '../../prisma/prisma.service.js';
export declare class ConnectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getReceivedRequests(userId: string): Promise<{
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
    getSentRequests(userId: string): Promise<{
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
    acceptRequest(connectionId: string, userId: string): Promise<{
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
    rejectRequest(connectionId: string, userId: string): Promise<{
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
    sendRequest(requesterId: string, recipientId: string): Promise<{
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
    private assertCanRespond;
}
