var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { uploadAvatar } from '../../utils/cloudinary/cloudinary.utility.js';
import * as bcrypt from 'bcrypt';
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, image) {
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const avatar = image ? await uploadAvatar(image) : undefined;
        try {
            return await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    passwordHash,
                    avatarUrl: avatar?.url,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    userType: true,
                    avatarUrl: true,
                    createdAt: true,
                },
            });
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'P2002') {
                throw new ConflictException('Email or phone number already exists');
            }
            throw error;
        }
    }
    async update(id, dto, image) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        const avatar = image ? await uploadAvatar(image) : undefined;
        try {
            return await this.prisma.user.update({
                where: { id },
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    ...(avatar ? { avatarUrl: avatar.url } : {}),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    userType: true,
                    avatarUrl: true,
                    createdAt: true,
                },
            });
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'P2002') {
                throw new ConflictException('Email or phone number already exists');
            }
            throw error;
        }
    }
    findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                userType: true,
                avatarUrl: true,
                createdAt: true,
            },
        });
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map