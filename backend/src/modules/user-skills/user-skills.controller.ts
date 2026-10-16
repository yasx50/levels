
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserSkillsService } from './user-skills.service.js';
import { AssignSkillDto } from './dto/assign-skill.dto.js';

@Controller('user-skills')
export class UserSkillsController {
  constructor(
    private readonly userSkillsService: UserSkillsService,
  ) {}

  @Post()
  assignSkill(@Body() dto: AssignSkillDto) {
    return this.userSkillsService.assignSkill(dto);
  }

  @Get(':userId')
  findUserSkills(@Param('userId') userId: string) {
    return this.userSkillsService.findUserSkills(userId);
  }

  @Delete(':userId/:skillId')
  removeSkill(
    @Param('userId') userId: string,
    @Param('skillId') skillId: string,
  ) {
    return this.userSkillsService.removeSkill(userId, skillId);
  }
}
