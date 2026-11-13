import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionStatus, NotificationType, Prisma } from '@prisma/client';
import type { Connection } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ConnectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async sendRequest(requesterId: string, recipientId: string) {
    if (requesterId === recipientId) {
      throw new BadRequestException(
        'You cannot send a connection request to yourself',
      );
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
          throw new ConflictException(
            existing.requesterId === requesterId
              ? 'A connection request is already pending'
              : 'An incoming connection request already exists',
          );
        }

        if (existing?.status === ConnectionStatus.BLOCKED) {
          throw new ConflictException(
            'A connection cannot be requested for this user',
          );
        }

        let created: Connection;
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
            throw new ConflictException(
              'A connection request for this user already exists',
            );
          }

          created = await transaction.connection.findUniqueOrThrow({
            where: { id: existing.id },
          });
        } else {
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const existing = await this.prisma.connection.findFirst({
          where: { pairKey },
          select: { requesterId: true, status: true },
        });

        if (existing?.status === ConnectionStatus.PENDING) {
          throw new ConflictException(
            existing.requesterId === requesterId
              ? 'A connection request is already pending'
              : 'An incoming connection request already exists',
          );
        }

        if (existing?.status === ConnectionStatus.ACCEPTED) {
          throw new ConflictException('An accepted connection already exists');
        }

        throw new ConflictException(
          'A connection request for this user already exists',
        );
      }

      throw error;
    }
  }
}
