import { PrismaService } from '../../prisma/prisma.service.js';
export declare class ConnectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
}
