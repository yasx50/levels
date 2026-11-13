import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionStatus, NotificationType, Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConnectionsService } from './connections.service.js';

describe('ConnectionsService', () => {
  const findRecipient = vi.fn();
  const findExistingConnection = vi.fn();
  const transaction = {
    connection: {
      findUnique: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
  };
  const prisma = {
    user: {
      findUnique: findRecipient,
    },
    connection: {
      findUnique: findExistingConnection,
    },
    $transaction: vi.fn(
      (callback: (client: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    ),
  } as unknown as PrismaService;
  const service = new ConnectionsService(prisma);

  const connection = {
    id: 'connection-id',
    requesterId: 'sender-id',
    recipientId: 'recipient-id',
    pairKey: 'recipient-id:sender-id',
    status: ConnectionStatus.PENDING,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    respondedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    findRecipient.mockResolvedValue({ id: 'recipient-id' });
    findExistingConnection.mockResolvedValue(null);
    transaction.connection.findUnique.mockResolvedValue(null);
    transaction.connection.create.mockResolvedValue(connection);
    transaction.notification.create.mockResolvedValue({});
  });

  it('creates a pending connection and a recipient notification atomically', async () => {
    const result = await service.sendRequest('sender-id', 'recipient-id');

    expect(prisma.$transaction).toHaveBeenCalledOnce();
    expect(transaction.connection.create).toHaveBeenCalledWith({
      data: {
        requesterId: 'sender-id',
        recipientId: 'recipient-id',
        pairKey: 'recipient-id:sender-id',
        status: ConnectionStatus.PENDING,
      },
    });
    expect(transaction.notification.create).toHaveBeenCalledWith({
      data: {
        recipientId: 'recipient-id',
        actorId: 'sender-id',
        type: NotificationType.CONNECTION_REQUEST,
        objectType: 'CONNECTION',
        objectId: 'connection-id',
      },
    });
    expect(result).toEqual({
      success: true,
      message: 'Connection request sent successfully',
      data: {
        id: 'connection-id',
        requesterId: 'sender-id',
        recipientId: 'recipient-id',
        status: ConnectionStatus.PENDING,
        createdAt: connection.createdAt,
      },
    });
  });

  it('rejects self-requests without querying the database', async () => {
    await expect(
      service.sendRequest('sender-id', 'sender-id'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('returns not found when the recipient does not exist', async () => {
    findRecipient.mockResolvedValue(null);

    await expect(
      service.sendRequest('sender-id', 'recipient-id'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it.each([
    [
      ConnectionStatus.ACCEPTED,
      'sender-id',
      'An accepted connection already exists',
    ],
    [
      ConnectionStatus.PENDING,
      'sender-id',
      'A connection request is already pending',
    ],
    [
      ConnectionStatus.PENDING,
      'recipient-id',
      'An incoming connection request already exists',
    ],
  ] as const)(
    'rejects existing %s relationship conflicts',
    async (status, existingRequesterId, expectedMessage) => {
      transaction.connection.findUnique.mockResolvedValue({
        ...connection,
        requesterId: existingRequesterId,
        status,
      });

      await expect(
        service.sendRequest('sender-id', 'recipient-id'),
      ).rejects.toMatchObject({
        response: { message: expectedMessage },
      });
      expect(transaction.connection.create).not.toHaveBeenCalled();
      expect(transaction.notification.create).not.toHaveBeenCalled();
    },
  );

  it('reopens a rejected relationship instead of creating a duplicate', async () => {
    transaction.connection.findUnique.mockResolvedValue({
      ...connection,
      requesterId: 'recipient-id',
      recipientId: 'sender-id',
      status: ConnectionStatus.REJECTED,
    });
    transaction.connection.updateMany.mockResolvedValue({ count: 1 });
    transaction.connection.findUniqueOrThrow.mockResolvedValue(connection);

    await service.sendRequest('sender-id', 'recipient-id');

    expect(transaction.connection.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'connection-id',
          status: ConnectionStatus.REJECTED,
        },
        data: expect.objectContaining({
          requesterId: 'sender-id',
          recipientId: 'recipient-id',
          status: ConnectionStatus.PENDING,
          respondedAt: null,
        }),
      }),
    );
    expect(transaction.connection.create).not.toHaveBeenCalled();
    expect(transaction.notification.create).toHaveBeenCalledOnce();
  });

  it('converts a unique-constraint race into a conflict response', async () => {
    transaction.connection.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );
    findExistingConnection.mockResolvedValue({
      requesterId: 'recipient-id',
      status: ConnectionStatus.PENDING,
    });

    await expect(
      service.sendRequest('sender-id', 'recipient-id'),
    ).rejects.toMatchObject({
      response: { message: 'An incoming connection request already exists' },
    });
  });

  it('rejects a blocked relationship', async () => {
    transaction.connection.findUnique.mockResolvedValue({
      ...connection,
      status: ConnectionStatus.BLOCKED,
    });

    await expect(
      service.sendRequest('sender-id', 'recipient-id'),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
