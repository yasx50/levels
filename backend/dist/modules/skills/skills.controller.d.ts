import { SkillsService } from './skills.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(dto: CreateSkillDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        category: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        category: string | null;
    }[]>;
}
