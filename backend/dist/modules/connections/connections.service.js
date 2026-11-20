var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { ConnectionStatus, NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
const profileSelect = {
    id: true,
    name: true,
    avatarUrl: true,
    image: true,
    field: true,
    role: true,
};
const responseTargetSelect = {
    id: true,
    requesterId: true,
    recipientId: true,
    status: true,
};
const responseConnectionSelect = {
    id: true,
    requesterId: true,
    recipientId: true,
    status: true,
    createdAt: true,
    respondedAt: true,
};
let ConnectionsService = class ConnectionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getReceivedRequests(userId) {
        const requests = await this.prisma.connection.findMany({
            where: { recipientId: userId, status: ConnectionStatus.PENDING },
            select: {
                id: true,
                requesterId: true,
                recipientId: true,
                status: true,
                createdAt: true,
                respondedAt: true,
                requester: { select: profileSelect },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: 'Received connection requests retrieved successfully',
            data: requests,
        };
    }
    async getSentRequests(userId) {
        const requests = await this.prisma.connection.findMany({
            where: { requesterId: userId, status: ConnectionStatus.PENDING },
            select: {
                id: true,
                requesterId: true,
                recipientId: true,
                status: true,
                createdAt: true,
                respondedAt: true,
                recipient: { select: profileSelect },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: 'Sent connection requests retrieved successfully',
            data: requests,
        };
    }
    async acceptRequest(connectionId, userId) {
        const connection = await this.prisma.$transaction(async (transaction) => {
            const request = await transaction.connection.findUnique({
                where: { id: connectionId },
                select: responseTargetSelect,
            });
            this.assertCanRespond(request, userId);
            const respondedAt = new Date();
            const updated = await transaction.connection.updateMany({
                where: {
                    id: connectionId,
                    recipientId: userId,
                    status: ConnectionStatus.PENDING,
                },
                data: { status: ConnectionStatus.ACCEPTED, respondedAt },
            });
            if (updated.count !== 1) {
                throw new ConflictException('Connection request is no longer pending');
            }
            const acceptedRequest = await transaction.connection.findUniqueOrThrow({
                where: { id: connectionId },
                select: responseConnectionSelect,
            });
            await transaction.notification.create({
                data: {
                    recipientId: request.requesterId,
                    actorId: userId,
                    type: NotificationType.CONNECTION_ACCEPTED,
                    objectType: 'CONNECTION',
                    objectId: connectionId,
                },
            });
            return acceptedRequest;
        });
        return {
            success: true,
            message: 'Connection request accepted successfully',
            data: connection,
        };
    }
    async rejectRequest(connectionId, userId) {
        const rejectedRequest = await this.prisma.$transaction(async (transaction) => {
            const request = await transaction.connection.findUnique({
                where: { id: connectionId },
                select: responseTargetSelect,
            });
            this.assertCanRespond(request, userId);
            const updated = await transaction.connection.updateMany({
                where: {
                    id: connectionId,
                    recipientId: userId,
                    status: ConnectionStatus.PENDING,
                },
                data: {
                    status: ConnectionStatus.REJECTED,
                    respondedAt: new Date(),
                },
            });
            if (updated.count !== 1) {
                throw new ConflictException('Connection request is no longer pending');
            }
            return transaction.connection.findUniqueOrThrow({
                where: { id: connectionId },
                select: responseConnectionSelect,
            });
        });
        return {
            success: true,
            message: 'Connection request rejected successfully',
            data: rejectedRequest,
        };
    }
    async sendRequest(requesterId, recipientId) {
        if (requesterId === recipientId) {
            throw new BadRequestException('You cannot send a connection request to yourself');
        }
        const recipient = await this.prisma.user.findUnique({
            where: { id: recipientId },
            select: { id: true },
        });
        if (!recipient) {
            throw new NotFoundException('Recipient not found');
        }
        const pairKey = [requesterId, recipientId].sort().join(':');
        try {
            const connection = await this.prisma.$transaction(async (transaction) => {
                const existing = await transaction.connection.findFirst({
                    where: { pairKey },
                });
                if (existing?.status === ConnectionStatus.ACCEPTED) {
                    throw new ConflictException('An accepted connection already exists');
                }
                if (existing?.status === ConnectionStatus.PENDING) {
                    throw new ConflictException(existing.requesterId === requesterId
                        ? 'A connection request is already pending'
                        : 'An incoming connection request already exists');
                }
                if (existing?.status === ConnectionStatus.BLOCKED) {
                    throw new ConflictException('A connection cannot be requested for this user');
                }
                let created;
                if (existing?.status === ConnectionStatus.REJECTED) {
                    const reopened = await transaction.connection.updateMany({
                        where: {
                            id: existing.id,
                            status: ConnectionStatus.REJECTED,
                        },
                        data: {
                            requesterId,
                            recipientId,
                            status: ConnectionStatus.PENDING,
                            respondedAt: null,
                            createdAt: new Date(),
                        },
                    });
                    if (reopened.count !== 1) {
                        throw new ConflictException('A connection request for this user already exists');
                    }
                    created = await transaction.connection.findUniqueOrThrow({
                        where: { id: existing.id },
                    });
                }
                else {
                    created = await transaction.connection.create({
                        data: {
                            requesterId,
                            recipientId,
                            pairKey,
                            status: ConnectionStatus.PENDING,
                        },
                    });
                }
                await transaction.notification.create({
                    data: {
                        recipientId,
                        actorId: requesterId,
                        type: NotificationType.CONNECTION_REQUEST,
                        objectType: 'CONNECTION',
                        objectId: created.id,
                    },
                });
                return created;
            });
            return {
                success: true,
                message: 'Connection request sent successfully',
                data: {
                    id: connection.id,
                    requesterId: connection.requesterId,
                    recipientId: connection.recipientId,
                    status: connection.status,
                    createdAt: connection.createdAt,
                },
            };
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                const existing = await this.prisma.connection.findFirst({
                    where: { pairKey },
                    select: { requesterId: true, status: true },
                });
                if (existing?.status === ConnectionStatus.PENDING) {
                    throw new ConflictException(existing.requesterId === requesterId
                        ? 'A connection request is already pending'
                        : 'An incoming connection request already exists');
                }
                if (existing?.status === ConnectionStatus.ACCEPTED) {
                    throw new ConflictException('An accepted connection already exists');
                }
                throw new ConflictException('A connection request for this user already exists');
            }
            throw error;
        }
    }
    assertCanRespond(request, userId) {
        if (!request) {
            throw new NotFoundException('Connection request not found');
        }
        if (request.requesterId === userId || request.recipientId !== userId) {
            throw new ForbiddenException('You are not allowed to respond to this connection request');
        }
        if (request.status !== ConnectionStatus.PENDING) {
            throw new ConflictException('Only pending connection requests can be accepted or rejected');
        }
    }
};
ConnectionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ConnectionsService);
export { ConnectionsService };
//# sourceMappingURL=connections.service.js.map