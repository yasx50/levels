
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { AcknowledgementsService } from './acknowledgements.service.js';
import { CreateAcknowledgementDto } from './dto/create-acknowledgement.dto.js';

@Controller('acknowledgements')
export class AcknowledgementsController {
  constructor(
    private readonly acknowledgementsService: AcknowledgementsService,
  ) {}

  @Post()
  create(@Body() dto: CreateAcknowledgementDto) {
    return this.acknowledgementsService.create(dto);
  }

  @Get('received/:userId')
  findReceived(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.acknowledgementsService.findReceived(userId);
  }

  @Get('given/:userId')
  findGiven(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.acknowledgementsService.findGiven(userId);
  }
}
