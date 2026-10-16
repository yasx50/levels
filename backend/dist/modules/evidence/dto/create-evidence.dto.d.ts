import { EvidenceType, Visibility } from '@prisma/client';
export declare class CreateEvidenceDto {
    userId: string;
    userSkillId?: string;
    type: EvidenceType;
    title: string;
    description?: string;
    url?: string;
    fileUrl?: string;
    organization?: string;
    startDate?: string;
    endDate?: string;
    visibility?: Visibility;
}
