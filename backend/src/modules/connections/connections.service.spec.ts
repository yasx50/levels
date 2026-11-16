import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionStatus, NotificationType, Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConnectionsService } from './connections.service.js';

describe('ConnectionsService', () => {
  const findRecipient = vi.fn();
  const findExistingConnection = vi.fn();
  const findConnectionRequests = vi.fn();
  const updateConnection = vi.fn();
  const findUpdatedConnection = vi.fn();
  const transaction = {
    connection: {
      findUnique: vi.fn(),
      findFirst: findExistingConnection,
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
      findFirst: findExistingConnection,
      findMany: findConnectionRequests,
      findUnique: vi.fn(),
      updateMany: updateConnection,
      findUniqueOrThrow: findUpdatedConnection,
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
    transaction.connection.updateMany.mockResolvedValue({ count: 1 });
    transaction.connection.findUniqueOrThrow.mockResolvedValue(connection);
    updateConnection.mockResolvedValue({ count: 1 });
    findUpdatedConnection.mockResolvedValue(connection);
    transaction.notification.create.mockResolvedValue({});
  });

  it('lists pending received requests with requester profiles, newest first', async () => {
    const requests = [{ ...connection, requester: { id: 'sender-id' } }];
    findConnectionRequests.mockResolvedValue(requests);

    await expect(service.getReceivedRequests('recipient-id')).resolves.toEqual({
      success: true,
      message: 'Received connection requests retrieved successfully',
      data: requests,
    });
    expect(findConnectionRequests).toHaveBeenCalledWith({
      where: {
        recipientId: 'recipient-id',
        status: ConnectionStatus.PENDING,
      },
      select: expect.objectContaining({
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            image: true,
            field: true,
            role: true,
          },
        },
      }),
      orderBy: { createdAt: 'desc' },
    });
  });

  it('lists pending sent requests with recipient profiles, newest first', async () => {
    const requests = [{ ...connection, recipient: { id: 'recipient-id' } }];
    findConnectionRequests.mockResolvedValue(requests);

    await expect(service.getSentRequests('sender-id')).resolves.toEqual({
      success: true,
      message: 'Sent connection requests retrieved successfully',
      data: requests,
    });
    expect(findConnectionRequests).toHaveBeenCalledWith({
      where: { requesterId: 'sender-id', status: ConnectionStatus.PENDING },
      select: expect.objectContaining({
        recipient: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            image: true,
            field: true,
            role: true,
          },
        },
      }),
      orderBy: { createdAt: 'desc' },
    });
  });

  it('accepts a pending request and notifies the original requester atomically', async () => {
    const acceptedRequest = {
      ...connection,
      status: ConnectionStatus.ACCEPTED,
      respondedAt: new Date(),
    };
    transaction.connection.findUnique.mockResolvedValue(connection);
    transaction.connection.findUniqueOrThrow.mockResolvedValue(acceptedRequest);

    await expect(
      service.acceptRequest('connection-id', 'recipient-id'),
    ).resolves.toEqual({
      success: true,
      message: 'Connection request accepted successfully',
      data: acceptedRequest,
    });

    expect(prisma.$transaction).toHaveBeenCalledOnce();
    expect(transaction.connection.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'connection-id',
        recipientId: 'recipient-id',
        status: ConnectionStatus.PENDING,
      },
      data: {
        status: ConnectionStatus.ACCEPTED,
        respondedAt: expect.any(Date),
      },
    });
    expect(transaction.notification.create).toHaveBeenCalledWith({
      data: {
        recipientId: 'sender-id',
        actorId: 'recipient-id',
        type: NotificationType.CONNECTION_ACCEPTED,
        objectType: 'CONNECTION',
        objectId: 'connection-id',
      },
    });
  });

  it('prevents requesters from accepting their own outgoing requests', async () => {
    transaction.connection.findUnique.mockResolvedValue(connection);

    await expect(
      service.acceptRequest('connection-id', 'sender-id'),
    ).rejects.toMatchObject({
      response: {
        statusCode: 403,
        message: 'You are not allowed to respond to this connection request',
      },
    });
    expect(transaction.connection.updateMany).not.toHaveBeenCalled();
    expect(transaction.notification.create).not.toHaveBeenCalled();
  });

  it.each([ConnectionStatus.ACCEPTED, ConnectionStatus.REJECTED])(
    'does not accept an already %s request',
    async (status) => {
      transaction.connection.findUnique.mockResolvedValue({
        ...connection,
        status,
      });

      await expect(
        service.acceptRequest('connection-id', 'recipient-id'),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(transaction.connection.updateMany).not.toHaveBeenCalled();
      expect(transaction.notification.create).not.toHaveBeenCalled();
    },
  );

  it('rejects a pending request and sets respondedAt', async () => {
    const rejectedRequest = {
      ...connection,
      status: ConnectionStatus.REJECTED,
      respondedAt: new Date(),
    };
    transaction.connection.findUnique.mockResolvedValue(connection);
    transaction.connection.findUniqueOrThrow.mockResolvedValue(rejectedRequest);

    await expect(
      service.rejectRequest('connection-id', 'recipient-id'),
    ).resolves.toEqual({
      success: true,
      message: 'Connection request rejected successfully',
      data: rejectedRequest,
    });
    expect(transaction.connection.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'connection-id',
        recipientId: 'recipient-id',
        status: ConnectionStatus.PENDING,
      },
      data: {
        status: ConnectionStatus.REJECTED,
        respondedAt: expect.any(Date),
      },
    });
    expect(prisma.$transaction).toHaveBeenCalledOnce();
  });

  it('prevents requesters from rejecting their own outgoing requests', async () => {
    transaction.connection.findUnique.mockResolvedValue(connection);

    await expect(
      service.rejectRequest('connection-id', 'sender-id'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(transaction.connection.updateMany).not.toHaveBeenCalled();
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
      findExistingConnection.mockResolvedValue({
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
    findExistingConnection.mockResolvedValue({
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
    findExistingConnection
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
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
    findExistingConnection.mockResolvedValue({
      ...connection,
      status: ConnectionStatus.BLOCKED,
    });

    await expect(
      service.sendRequest('sender-id', 'recipient-id'),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
