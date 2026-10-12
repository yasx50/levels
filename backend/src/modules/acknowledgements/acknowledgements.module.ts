import { Module } from '@nestjs/common';
import { AcknowledgementsController } from './acknowledgements.controller.js';
import { AcknowledgementsService } from './acknowledgements.service.js';

@Module({
  controllers: [AcknowledgementsController],
  providers: [AcknowledgementsService]
})
export class AcknowledgementsModule {}
