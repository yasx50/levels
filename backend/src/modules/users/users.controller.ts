import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { AvatarFile } from '../../utils/cloudinary/cloudinary.utility.js';
import { MAX_AVATAR_SIZE } from '../../utils/cloudinary/cloudinary.utility.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: MAX_AVATAR_SIZE } }),
  )
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image?: AvatarFile,
  ) {
    return this.usersService.create(createUserDto, image);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: MAX_AVATAR_SIZE } }),
  )
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image?: AvatarFile,
  ) {
    return this.usersService.update(id, updateUserDto, image);
  }
}
