import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  const createUser = vi.fn();
  const createAccount = vi.fn();
  const transaction = {
    user: { create: createUser },
    account: { create: createAccount },
  };
  const runTransaction = vi.fn(
    (callback: (client: typeof transaction) => Promise<unknown>) =>
      callback(transaction),
  );
  const prisma = {
    $transaction: runTransaction,
  } as unknown as PrismaService;
  const service = new UsersService(prisma);

  beforeEach(() => {
    vi.clearAllMocks();
    createUser.mockResolvedValue({
      id: 'user-id',
      name: 'Test User',
      email: 'person@example.com',
      phone: null,
      userType: 'STUDENT',
      avatarUrl: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    createAccount.mockResolvedValue({});
  });

  it('creates email credentials with the user in one transaction', async () => {
    await service.create({
      name: 'Test User',
      email: ' Person@Example.com ',
      password: 'a-secure-password',
    });

    expect(runTransaction).toHaveBeenCalledOnce();
    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'person@example.com',
        }),
      }),
    );

    const accountData = createAccount.mock.calls[0][0].data;
    expect(accountData).toEqual(
      expect.objectContaining({
        accountId: 'user-id',
        providerId: 'credential',
        userId: 'user-id',
      }),
    );
    expect(accountData.password).toMatch(/^\$2[aby]\$/);
  });

  it('does not create email credentials when the user has no email', async () => {
    createUser.mockResolvedValue({
      id: 'user-id',
      name: 'Test User',
      email: null,
      phone: '5551234',
      userType: 'STUDENT',
      avatarUrl: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await service.create({
      name: 'Test User',
      phone: '5551234',
      password: 'a-secure-password',
    });

    expect(createAccount).not.toHaveBeenCalled();
  });
});
