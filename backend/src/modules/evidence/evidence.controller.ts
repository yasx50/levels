
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { EvidenceService } from './evidence.service.js';
import { CreateEvidenceDto } from './dto/create-evidence.dto.js';

@Controller('evidence')
export class EvidenceController {
  constructor(
    private readonly evidenceService: EvidenceService,
  ) {}

  @Post()
  create(@Body() dto: CreateEvidenceDto) {
    return this.evidenceService.create(dto);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.evidenceService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.evidenceService.findOne(id);
  }
}
