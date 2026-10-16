var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let SkillsService = class SkillsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        try {
            return await this.prisma.skill.create({
                data: {
                    name: dto.name.trim(),
                    category: dto.category?.trim(),
                },
            });
        }
        catch (error) {
            if (typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 'P2002') {
                throw new ConflictException('A skill with this name already exists.');
            }
            throw error;
        }
    }
    findAll() {
        return this.prisma.skill.findMany({
            orderBy: { name: 'asc' },
        });
    }
};
SkillsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SkillsService);
export { SkillsService };
//# sourceMappingURL=skills.service.js.map