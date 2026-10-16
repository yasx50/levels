var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
;
import { LevelsService } from '../levels/levels.service.js';
let AcknowledgementsService = class AcknowledgementsService {
    prisma;
    levelsService;
    constructor(prisma, levelsService) {
        this.prisma = prisma;
        this.levelsService = levelsService;
    }
    async create(dto) {
        const { fromUserId, toUserId, skillId, evidenceId, reason, } = dto;
        if (fromUserId === toUserId) {
            throw new BadRequestException('You cannot acknowledge your own skill');
        }
        const [sender, recipient] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: fromUserId },
                select: { id: true },
            }),
            this.prisma.user.findUnique({
                where: { id: toUserId },
                select: { id: true },
            }),
        ]);
        if (!sender) {
            throw new NotFoundException('Sender user not found');
        }
        if (!recipient) {
            throw new NotFoundException('Recipient user not found');
        }
        const recipientSkill = await this.prisma.userSkill.findUnique({
            where: {
                userId_skillId: {
                    userId: toUserId,
                    skillId,
                },
            },
            select: { id: true },
        });
        if (!recipientSkill) {
            throw new BadRequestException('The recipient does not have this skill');
        }
        if (evidenceId) {
            const evidence = await this.prisma.evidence.findFirst({
                where: {
                    id: evidenceId,
                    userId: toUserId,
                    userSkillId: recipientSkill.id,
                },
                select: { id: true },
            });
            if (!evidence) {
                throw new BadRequestException('Evidence must belong to the recipient and selected skill');
            }
        }
        const existing = await this.prisma.acknowledgement.findUnique({
            where: {
                fromUserId_toUserId_skillId: {
                    fromUserId,
                    toUserId,
                    skillId,
                },
            },
        });
        if (existing) {
            throw new ConflictException('You have already acknowledged this skill for this user');
        }
        let acknowledgement;
        try {
            acknowledgement = await this.prisma.$transaction(async (tx) => {
                const created = await tx.acknowledgement.create({
                    data: {
                        fromUserId,
                        toUserId,
                        skillId,
                        evidenceId,
                        reason,
                        weight: 1,
                    },
                    include: {
                        skill: true,
                        evidence: true,
                    },
                });
                await tx.userSkill.update({
                    where: {
                        userId_skillId: {
                            userId: toUserId,
                            skillId,
                        },
                    },
                    data: {
                        acknowledgementCount: {
                            increment: 1,
                        },
                    },
                });
                return created;
            });
        }
        catch (error) {
            if (error instanceof
                Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new ConflictException('This acknowledgement already exists');
            }
            throw error;
        }
        const updatedLevel = await this.levelsService.recalculateUserLevel(toUserId);
        return {
            message: 'Acknowledgement created successfully',
            acknowledgement,
            level: updatedLevel,
        };
    }
    async findReceived(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.prisma.acknowledgement.findMany({
            where: { toUserId: userId },
            include: {
                skill: true,
                evidence: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findGiven(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.prisma.acknowledgement.findMany({
            where: { fromUserId: userId },
            include: {
                skill: true,
                evidence: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
AcknowledgementsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        LevelsService])
], AcknowledgementsService);
export { AcknowledgementsService };
//# sourceMappingURL=acknowledgements.service.js.map