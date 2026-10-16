var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, } from '@nestjs/common';
import { AcknowledgementsService } from './acknowledgements.service.js';
import { CreateAcknowledgementDto } from './dto/create-acknowledgement.dto.js';
let AcknowledgementsController = class AcknowledgementsController {
    acknowledgementsService;
    constructor(acknowledgementsService) {
        this.acknowledgementsService = acknowledgementsService;
    }
    create(dto) {
        return this.acknowledgementsService.create(dto);
    }
    findReceived(userId) {
        return this.acknowledgementsService.findReceived(userId);
    }
    findGiven(userId) {
        return this.acknowledgementsService.findGiven(userId);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAcknowledgementDto]),
    __metadata("design:returntype", void 0)
], AcknowledgementsController.prototype, "create", null);
__decorate([
    Get('received/:userId'),
    __param(0, Param('userId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcknowledgementsController.prototype, "findReceived", null);
__decorate([
    Get('given/:userId'),
    __param(0, Param('userId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcknowledgementsController.prototype, "findGiven", null);
AcknowledgementsController = __decorate([
    Controller('acknowledgements'),
    __metadata("design:paramtypes", [AcknowledgementsService])
], AcknowledgementsController);
export { AcknowledgementsController };
//# sourceMappingURL=acknowledgements.controller.js.map