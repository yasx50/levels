import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        name: string;
        email: string | null;
        phone: string | null;
        id: string;
        userType: import("@prisma/client").$Enums.UserType;
        createdAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        email: string | null;
        phone: string | null;
        id: string;
        userType: import("@prisma/client").$Enums.UserType;
        createdAt: Date;
    }[]>;
}
