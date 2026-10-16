import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LevelsService } from '../levels/levels.service.js';
import { CreateAcknowledgementDto } from './dto/create-acknowledgement.dto.js';
export declare class AcknowledgementsService {
    private readonly prisma;
    private readonly levelsService;
    constructor(prisma: PrismaService, levelsService: LevelsService);
    create(dto: CreateAcknowledgementDto): Promise<{
        message: string;
        acknowledgement: {
            skill: {
                name: string;
                id: string;
                createdAt: Date;
                category: string | null;
            };
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            skillId: string;
            fromUserId: string;
            toUserId: string;
            evidenceId: string | null;
            reason: string | null;
            weight: Prisma.Decimal;
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
    findReceived(userId: string): Promise<({
        skill: {
            name: string;
            id: string;
            createdAt: Date;
            category: string | null;
        };
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        skillId: string;
        fromUserId: string;
        toUserId: string;
        evidenceId: string | null;
        reason: string | null;
        weight: Prisma.Decimal;
    })[]>;
    findGiven(userId: string): Promise<({
        skill: {
            name: string;
            id: string;
            createdAt: Date;
            category: string | null;
        };
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        skillId: string;
        fromUserId: string;
        toUserId: string;
        evidenceId: string | null;
        reason: string | null;
        weight: Prisma.Decimal;
    })[]>;
}
