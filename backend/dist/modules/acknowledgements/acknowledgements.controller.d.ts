import { AcknowledgementsService } from './acknowledgements.service.js';
import { CreateAcknowledgementDto } from './dto/create-acknowledgement.dto.js';
export declare class AcknowledgementsController {
    private readonly acknowledgementsService;
    constructor(acknowledgementsService: AcknowledgementsService);
    create(dto: CreateAcknowledgementDto): Promise<{
        message: string;
        acknowledgement: {
            skill: {
                id: string;
                createdAt: Date;
                name: string;
                category: string | null;
            };
            evidence: {
                url: string | null;
                id: string;
                createdAt: Date;
                userId: string;
                description: string | null;
                userSkillId: string | null;
                type: import("@prisma/client").$Enums.EvidenceType;
                title: string;
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
            weight: import("@prisma/client/runtime/library").Decimal;
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
            id: string;
            createdAt: Date;
            name: string;
            category: string | null;
        };
        evidence: {
            url: string | null;
            id: string;
            createdAt: Date;
            userId: string;
            description: string | null;
            userSkillId: string | null;
            type: import("@prisma/client").$Enums.EvidenceType;
            title: string;
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
        weight: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findGiven(userId: string): Promise<({
        skill: {
            id: string;
            createdAt: Date;
            name: string;
            category: string | null;
        };
        evidence: {
            url: string | null;
            id: string;
            createdAt: Date;
            userId: string;
            description: string | null;
            userSkillId: string | null;
            type: import("@prisma/client").$Enums.EvidenceType;
            title: string;
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
        weight: import("@prisma/client/runtime/library").Decimal;
    })[]>;
}
