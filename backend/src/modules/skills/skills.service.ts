import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSkillDto) {
    try {
      return await this.prisma.skill.create({
        data: {
          name: dto.name.trim(),
          category: dto.category?.trim(),
        },
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A skill with this name already exists.',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
  }
}