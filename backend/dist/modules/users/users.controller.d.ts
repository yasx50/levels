import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
