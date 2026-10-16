
import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module.js';
import { LevelsModule } from '../levels/levels.module.js';
import { AcknowledgementsController } from './acknowledgements.controller.js';
import { AcknowledgementsService } from './acknowledgements.service.js';

@Module({
  imports: [PrismaModule, LevelsModule],
  controllers: [AcknowledgementsController],
  providers: [AcknowledgementsService],
})
export class AcknowledgementsModule {}
