var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let UserSkillsService = class UserSkillsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignSkill(dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const skill = await this.prisma.skill.findUnique({
            where: { id: dto.skillId },
            select: { id: true },
        });
        if (!skill) {
            throw new NotFoundException('Skill not found');
        }
        const existing = await this.prisma.userSkill.findUnique({
            where: {
                userId_skillId: {
                    userId: dto.userId,
                    skillId: dto.skillId,
                },
            },
        });
        if (existing) {
            throw new ConflictException('This skill is already assigned to the user');
        }
        return this.prisma.userSkill.create({
            data: {
                userId: dto.userId,
                skillId: dto.skillId,
                yearsExperience: dto.yearsExperience,
            },
            include: {
                skill: true,
            },
        });
    }
    findUserSkills(userId) {
        return this.prisma.userSkill.findMany({
            where: { userId },
            include: {
                skill: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async removeSkill(userId, skillId) {
        const assignment = await this.prisma.userSkill.findUnique({
            where: {
                userId_skillId: { userId, skillId },
            },
        });
        if (!assignment) {
            throw new NotFoundException('This skill is not assigned to the user');
        }
        return this.prisma.userSkill.delete({
            where: {
                userId_skillId: { userId, skillId },
            },
        });
    }
};
UserSkillsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UserSkillsService);
export { UserSkillsService };
//# sourceMappingURL=user-skills.service.js.map