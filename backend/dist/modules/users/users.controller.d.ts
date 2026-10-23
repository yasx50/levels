import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
