import { LevelsService } from './levels.service.js';
export declare class LevelsController {
    private readonly levelsService;
    constructor(levelsService: LevelsService);
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
}
