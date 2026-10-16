import { PrismaService } from '../../prisma/prisma.service.js';
import { AssignSkillDto } from './dto/assign-skill.dto.js';
export declare class UserSkillsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assignSkill(dto: AssignSkillDto): Promise<{
        skill: {
            name: string;
            id: string;
            createdAt: Date;
            category: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        skillId: string;
        yearsExperience: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.UserSkillStatus;
        acknowledgementCount: number;
        evidenceCount: number;
    }>;
    findUserSkills(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
        skill: {
            name: string;
            id: string;
            createdAt: Date;
            category: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        skillId: string;
        yearsExperience: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.UserSkillStatus;
        acknowledgementCount: number;
        evidenceCount: number;
    })[]>;
    removeSkill(userId: string, skillId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        skillId: string;
        yearsExperience: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.UserSkillStatus;
        acknowledgementCount: number;
        evidenceCount: number;
    }>;
}
