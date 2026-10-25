import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { AvatarFile } from '../../utils/cloudinary/cloudinary.utility.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto, image?: AvatarFile): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        userType: import("@prisma/client").$Enums.UserType;
        avatarUrl: string | null;
    }>;
    update(id: string, dto: UpdateUserDto, image?: AvatarFile): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        userType: import("@prisma/client").$Enums.UserType;
        avatarUrl: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string | null;
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        userType: import("@prisma/client").$Enums.UserType;
        avatarUrl: string | null;
    }[]>;
}
