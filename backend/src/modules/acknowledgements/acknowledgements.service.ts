
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service.js';;
import { LevelsService } from '../levels/levels.service.js';
import { CreateAcknowledgementDto } from './dto/create-acknowledgement.dto.js';

@Injectable()
export class AcknowledgementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly levelsService: LevelsService,
  ) {}

  async create(dto: CreateAcknowledgementDto) {
    const {
      fromUserId,
      toUserId,
      skillId,
      evidenceId,
      reason,
    } = dto;

    // 1. A user cannot acknowledge themselves.
    if (fromUserId === toUserId) {
      throw new BadRequestException(
        'You cannot acknowledge your own skill',
      );
    }

    // 2. Both users must exist.
    const [sender, recipient] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: fromUserId },
        select: { id: true },
      }),
      this.prisma.user.findUnique({
        where: { id: toUserId },
        select: { id: true },
      }),
    ]);

    if (!sender) {
      throw new NotFoundException('Sender user not found');
    }

    if (!recipient) {
      throw new NotFoundException('Recipient user not found');
    }

    // 3. The recipient must have this skill.
    const recipientSkill =
      await this.prisma.userSkill.findUnique({
        where: {
          userId_skillId: {
            userId: toUserId,
            skillId,
          },
        },
        select: { id: true },
      });

    if (!recipientSkill) {
      throw new BadRequestException(
        'The recipient does not have this skill',
      );
    }

    // 4. If evidence is supplied, it must belong to the
    // recipient and be linked to the selected skill.
    if (evidenceId) {
      const evidence =
        await this.prisma.evidence.findFirst({
          where: {
            id: evidenceId,
            userId: toUserId,
            userSkillId: recipientSkill.id,
          },
          select: { id: true },
        });

      if (!evidence) {
        throw new BadRequestException(
          'Evidence must belong to the recipient and selected skill',
        );
      }
    }

    // 5. Prevent duplicate acknowledgement.
    const existing =
      await this.prisma.acknowledgement.findUnique({
        where: {
          fromUserId_toUserId_skillId: {
            fromUserId,
            toUserId,
            skillId,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'You have already acknowledged this skill for this user',
      );
    }

    // 6. Save acknowledgement and increment the skill counter
    // in one transaction.
    let acknowledgement;

    try {
      acknowledgement = await this.prisma.$transaction(
        async (tx) => {
          const created =
            await tx.acknowledgement.create({
              data: {
                fromUserId,
                toUserId,
                skillId,
                evidenceId,
                reason,
                weight: 1,
              },
              include: {
                skill: true,
                evidence: true,
              },
            });

          await tx.userSkill.update({
            where: {
              userId_skillId: {
                userId: toUserId,
                skillId,
              },
            },
            data: {
              acknowledgementCount: {
                increment: 1,
              },
            },
          });

          return created;
        },
      );
    } catch (error) {
      // The database unique constraint also protects against
      // two duplicate requests arriving simultaneously.
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'This acknowledgement already exists',
        );
      }

      throw error;
    }

    // 7. Recalculate the recipient's score and level.
    const updatedLevel =
      await this.levelsService.recalculateUserLevel(toUserId);

    return {
      message: 'Acknowledgement created successfully',
      acknowledgement,
      level: updatedLevel,
    };
  }

  // Get acknowledgements received by a user.
  async findReceived(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.acknowledgement.findMany({
      where: { toUserId: userId },
      include: {
        skill: true,
        evidence: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get acknowledgements given by a user.
  async findGiven(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.acknowledgement.findMany({
      where: { fromUserId: userId },
      include: {
        skill: true,
        evidence: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
