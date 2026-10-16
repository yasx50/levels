var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LevelsService } from '../levels/levels.service.js';
let EvidenceService = class EvidenceService {
    prisma;
    levelsService;
    constructor(prisma, levelsService) {
        this.prisma = prisma;
        this.levelsService = levelsService;
    }
    async create(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (dto.userSkillId) {
            const userSkill = await this.prisma.userSkill.findFirst({
                where: {
                    id: dto.userSkillId,
                    userId: dto.userId,
                },
                select: { id: true },
            });
            if (!userSkill) {
                throw new BadRequestException('The selected skill does not belong to this user');
            }
        }
        if (dto.startDate &&
            dto.endDate &&
            new Date(dto.endDate) < new Date(dto.startDate)) {
            throw new BadRequestException('endDate cannot be earlier than startDate');
        }
        const evidence = await this.prisma.evidence.create({
            data: {
                user: {
                    connect: { id: dto.userId },
                },
                ...(dto.userSkillId
                    ? {
                        userSkill: {
                            connect: { id: dto.userSkillId },
                        },
                    }
                    : {}),
                type: dto.type,
                title: dto.title,
                description: dto.description,
                url: dto.url,
                fileUrl: dto.fileUrl,
                organization: dto.organization,
                startDate: dto.startDate
                    ? new Date(dto.startDate)
                    : undefined,
                endDate: dto.endDate
                    ? new Date(dto.endDate)
                    : undefined,
                visibility: dto.visibility ?? 'PUBLIC',
                verificationStatus: 'UNVERIFIED',
            },
        });
        const levelResult = await this.levelsService.recalculateUserLevel(dto.userId);
        return {
            message: 'Evidence created successfully',
            evidence,
            level: levelResult,
        };
    }
    async findByUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.prisma.evidence.findMany({
            where: { userId },
            include: {
                userSkill: {
                    include: { skill: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const evidence = await this.prisma.evidence.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        levelNumber: true,
                        score: true,
                    },
                },
                userSkill: {
                    include: { skill: true },
                },
            },
        });
        if (!evidence) {
            throw new NotFoundException('Evidence not found');
        }
        return evidence;
    }
};
EvidenceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        LevelsService])
], EvidenceService);
export { EvidenceService };
//# sourceMappingURL=evidence.service.js.map