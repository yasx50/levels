import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { AvatarFile } from '../../utils/cloudinary/cloudinary.utility.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, image?: AvatarFile): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto, image?: AvatarFile): Promise<{
        email: string | null;
        id: string;
        createdAt: Date;
        name: string;
        phone: string | null;
        userType: import("@prisma/client").$Enums.UserType;
        avatarUrl: string | null;
    }>;
}
