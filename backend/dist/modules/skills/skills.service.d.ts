import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
export declare class SkillsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSkillDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        category: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        category: string | null;
    }[]>;
}
