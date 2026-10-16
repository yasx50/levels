var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
const LEVELS = [
    { levelNumber: 14, name: 'First Fire', threshold: 0 },
    { levelNumber: 12, name: 'Survival', threshold: 10 },
    { levelNumber: 11, name: 'Civilization', threshold: 20 },
    { levelNumber: 10, name: 'Industrial', threshold: 30 },
    { levelNumber: 8, name: 'Electrical', threshold: 40 },
    { levelNumber: 7, name: 'Modern', threshold: 50 },
    { levelNumber: 5, name: 'Digital', threshold: 60 },
    { levelNumber: 4, name: 'AI', threshold: 70 },
    { levelNumber: 2, name: 'Space', threshold: 80 },
    { levelNumber: 1, name: 'Mars', threshold: 90 },
];
const clamp = (value) => Math.max(0, Math.min(100, value));
const average = (values) => values.length
    ? values.reduce((sum, value) => sum + value, 0) /
        values.length
    : 0;
let LevelsService = class LevelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        for (const level of LEVELS) {
            await this.prisma.level.upsert({
                where: { levelNumber: level.levelNumber },
                update: {
                    name: level.name,
                    scoreThreshold: level.threshold,
                },
                create: {
                    levelNumber: level.levelNumber,
                    name: level.name,
                    scoreThreshold: level.threshold,
                },
            });
        }
    }
    async getAllLevels() {
        return this.prisma.level.findMany({
            orderBy: { scoreThreshold: 'asc' },
        });
    }
    async getUserLevel(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { level: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            userId: user.id,
            score: Number(user.score),
            levelNumber: user.levelNumber,
            level: user.level,
        };
    }
    async recalculateUserLevel(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const [evidence, userSkills, receivedAcks, givenAckCount] = await Promise.all([
            this.prisma.evidence.findMany({
                where: { userId },
                select: {
                    type: true,
                    verificationStatus: true,
                },
            }),
            this.prisma.userSkill.findMany({
                where: { userId },
                select: { yearsExperience: true },
            }),
            this.prisma.acknowledgement.findMany({
                where: { toUserId: userId },
                select: { weight: true },
            }),
            this.prisma.acknowledgement.count({
                where: { fromUserId: userId },
            }),
        ]);
        const evidenceQuality = {
            VERIFIED: 100,
            PENDING: 40,
            UNVERIFIED: 20,
            REJECTED: 0,
        };
        const evidenceScore = average(evidence.map((item) => evidenceQuality[item.verificationStatus]));
        const workTypes = [
            'PROJECT',
            'PORTFOLIO',
            'RESEARCH',
            'ACHIEVEMENT',
        ];
        const workCount = evidence.filter((item) => workTypes.includes(item.type)).length;
        const projectScore = clamp(workCount * 25);
        const totalRecognitionWeight = receivedAcks.reduce((sum, ack) => sum + Number(ack.weight), 0);
        const recognitionScore = clamp(totalRecognitionWeight * 10);
        const maxYears = Math.max(0, ...userSkills.map((skill) => Number(skill.yearsExperience ?? 0)));
        const experienceScore = clamp((maxYears / 10) * 100);
        const trustScore = clamp(Number(user.trustScore) * 100);
        const activityScore = clamp(evidence.length * 10 + givenAckCount * 5);
        const trustAndActivityScore = trustScore * 0.7 + activityScore * 0.3;
        const score = Number((evidenceScore * 0.30 +
            projectScore * 0.25 +
            recognitionScore * 0.20 +
            experienceScore * 0.15 +
            trustAndActivityScore * 0.10).toFixed(2));
        const eligibleLevel = await this.prisma.level.findFirst({
            where: {
                scoreThreshold: { lte: score },
            },
            orderBy: { scoreThreshold: 'desc' },
        });
        if (!eligibleLevel) {
            throw new Error('No eligible level found. Check level thresholds.');
        }
        const levelChanged = user.levelNumber !== eligibleLevel.levelNumber;
        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: {
                    score,
                    levelNumber: eligibleLevel.levelNumber,
                },
            });
            if (levelChanged) {
                await tx.levelHistory.create({
                    data: {
                        userId,
                        levelNumber: eligibleLevel.levelNumber,
                        scoreAtTime: score,
                    },
                });
            }
        });
        return {
            userId,
            score,
            previousLevel: user.levelNumber,
            currentLevel: eligibleLevel.levelNumber,
            levelName: eligibleLevel.name,
            levelChanged,
            breakdown: {
                evidence: Number(evidenceScore.toFixed(2)),
                projectsAndWork: projectScore,
                recognition: Number(recognitionScore.toFixed(2)),
                experience: experienceScore,
                trustAndActivity: Number(trustAndActivityScore.toFixed(2)),
            },
        };
    }
};
LevelsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], LevelsService);
export { LevelsService };
//# sourceMappingURL=levels.service.js.map