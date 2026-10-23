import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        userType: import("@prisma/client").$Enums.UserType;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string | null;
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        userType: import("@prisma/client").$Enums.UserType;
    }[]>;
}
