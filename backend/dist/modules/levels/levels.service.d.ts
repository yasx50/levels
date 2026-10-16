import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
export declare class LevelsService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getAllLevels(): Promise<{
        name: string;
        levelNumber: number;
        scoreThreshold: import("@prisma/client/runtime/library").Decimal;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
        description: string | null;
    }[]>;
    getUserLevel(userId: string): Promise<{
        userId: string;
        score: number;
        levelNumber: number;
        level: {
            name: string;
            levelNumber: number;
            scoreThreshold: import("@prisma/client/runtime/library").Decimal;
            themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
            description: string | null;
        };
    }>;
    recalculateUserLevel(userId: string): Promise<{
        userId: string;
        score: number;
        previousLevel: number;
        currentLevel: number;
        levelName: string;
        levelChanged: boolean;
        breakdown: {
            evidence: number;
            projectsAndWork: number;
            recognition: number;
            experience: number;
            trustAndActivity: number;
        };
    }>;
}
