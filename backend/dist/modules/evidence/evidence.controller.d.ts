import { EvidenceService } from './evidence.service.js';
import { CreateEvidenceDto } from './dto/create-evidence.dto.js';
export declare class EvidenceController {
    private readonly evidenceService;
    constructor(evidenceService: EvidenceService);
    create(dto: CreateEvidenceDto): Promise<{
        message: string;
        evidence: {
            id: string;
            createdAt: Date;
            userId: string;
            description: string | null;
            userSkillId: string | null;
            type: import("@prisma/client").$Enums.EvidenceType;
            title: string;
            url: string | null;
            fileUrl: string | null;
            organization: string | null;
            startDate: Date | null;
            endDate: Date | null;
            visibility: import("@prisma/client").$Enums.Visibility;
            verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        };
        level: {
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
        };
    }>;
    findByUser(userId: string): Promise<({
        userSkill: ({
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
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        description: string | null;
        userSkillId: string | null;
        type: import("@prisma/client").$Enums.EvidenceType;
        title: string;
        url: string | null;
        fileUrl: string | null;
        organization: string | null;
        startDate: Date | null;
        endDate: Date | null;
        visibility: import("@prisma/client").$Enums.Visibility;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            score: import("@prisma/client/runtime/library").Decimal;
            levelNumber: number;
        };
        userSkill: ({
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
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        description: string | null;
        userSkillId: string | null;
        type: import("@prisma/client").$Enums.EvidenceType;
        title: string;
        url: string | null;
        fileUrl: string | null;
        organization: string | null;
        startDate: Date | null;
        endDate: Date | null;
        visibility: import("@prisma/client").$Enums.Visibility;
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
    }>;
}
