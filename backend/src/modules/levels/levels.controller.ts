
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LevelsService } from './levels.service.js';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  getAllLevels() {
    return this.levelsService.getAllLevels();
  }

  @Get('user/:userId')
  getUserLevel(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.levelsService.getUserLevel(userId);
  }
}
