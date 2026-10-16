
import { Module } from '@nestjs/common';
import { UserSkillsController } from './user-skills.controller.js';
import { UserSkillsService } from './user-skills.service.js';

@Module({
  controllers: [UserSkillsController],
  providers: [UserSkillsService],
})
export class UserSkillsModule {}
