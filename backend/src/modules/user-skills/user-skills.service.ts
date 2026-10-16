
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AssignSkillDto } from './dto/assign-skill.dto.js';

@Injectable()
export class UserSkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async assignSkill(dto: AssignSkillDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skill = await this.prisma.skill.findUnique({
      where: { id: dto.skillId },
      select: { id: true },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    const existing = await this.prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId: dto.userId,
          skillId: dto.skillId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'This skill is already assigned to the user',
      );
    }

    return this.prisma.userSkill.create({
      data: {
        userId: dto.userId,
        skillId: dto.skillId,
        yearsExperience: dto.yearsExperience,
      },
      include: {
        skill: true,
      },
    });
  }

  findUserSkills(userId: string) {
    return this.prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeSkill(userId: string, skillId: string) {
    const assignment = await this.prisma.userSkill.findUnique({
      where: {
        userId_skillId: { userId, skillId },
      },
    });

    if (!assignment) {
      throw new NotFoundException(
        'This skill is not assigned to the user',
      );
    }

    return this.prisma.userSkill.delete({
      where: {
        userId_skillId: { userId, skillId },
      },
    });
  }
}
