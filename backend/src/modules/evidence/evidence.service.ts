
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';
import { LevelsService } from '../levels/levels.service.js';
import { CreateEvidenceDto } from './dto/create-evidence.dto.js';

@Injectable()
export class EvidenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly levelsService: LevelsService,
  ) {}

  async create(dto: CreateEvidenceDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.userSkillId) {
      const userSkill = await this.prisma.userSkill.findFirst({
        where: {
          id: dto.userSkillId,
          userId: dto.userId,
        },
        select: { id: true },
      });

      if (!userSkill) {
        throw new BadRequestException(
          'The selected skill does not belong to this user',
        );
      }
    }

    if (
      dto.startDate &&
      dto.endDate &&
      new Date(dto.endDate) < new Date(dto.startDate)
    ) {
      throw new BadRequestException(
        'endDate cannot be earlier than startDate',
      );
    }

    const evidence = await this.prisma.evidence.create({
      data: {
        user: {
          connect: { id: dto.userId },
        },

        ...(dto.userSkillId
          ? {
              userSkill: {
                connect: { id: dto.userSkillId },
              },
            }
          : {}),

        type: dto.type,
        title: dto.title,
        description: dto.description,
        url: dto.url,
        fileUrl: dto.fileUrl,
        organization: dto.organization,
        startDate: dto.startDate
          ? new Date(dto.startDate)
          : undefined,
        endDate: dto.endDate
          ? new Date(dto.endDate)
          : undefined,
        visibility: dto.visibility ?? 'PUBLIC',

        // Users cannot self-verify evidence by submitting a DTO.
        verificationStatus: 'UNVERIFIED',
      },
    });

    const levelResult =
      await this.levelsService.recalculateUserLevel(dto.userId);

    return {
      message: 'Evidence created successfully',
      evidence,
      level: levelResult,
    };
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.evidence.findMany({
      where: { userId },
      include: {
        userSkill: {
          include: { skill: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evidence = await this.prisma.evidence.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            levelNumber: true,
            score: true,
          },
        },
        userSkill: {
          include: { skill: true },
        },
      },
    });

    if (!evidence) {
      throw new NotFoundException('Evidence not found');
    }

    return evidence;
  }
}
