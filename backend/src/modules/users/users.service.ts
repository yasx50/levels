import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { uploadAvatar } from '../../utils/cloudinary/cloudinary.utility.js';
import type { AvatarFile } from '../../utils/cloudinary/cloudinary.utility.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto, image?: AvatarFile) {
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
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email or phone number already exists');
      }

      throw error;
    }
  }

  async update(id: string, dto: UpdateUserDto, image?: AvatarFile) {
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
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
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
}
