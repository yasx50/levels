
import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module.js';
import { LevelsModule } from '../levels/levels.module.js';
import { EvidenceController } from './evidence.controller.js';
import { EvidenceService } from './evidence.service.js';

@Module({
  imports: [PrismaModule, LevelsModule],
  controllers: [EvidenceController],
  providers: [EvidenceService],
})
export class EvidenceModule {}
