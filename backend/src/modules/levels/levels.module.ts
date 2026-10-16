
import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller.js';
import { LevelsService } from './levels.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [LevelsService],
})
export class LevelsModule {}
