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
import { EvidenceService } from './evidence.service.js';
import { CreateEvidenceDto } from './dto/create-evidence.dto.js';
let EvidenceController = class EvidenceController {
    evidenceService;
    constructor(evidenceService) {
        this.evidenceService = evidenceService;
    }
    create(dto) {
        return this.evidenceService.create(dto);
    }
    findByUser(userId) {
        return this.evidenceService.findByUser(userId);
    }
    findOne(id) {
        return this.evidenceService.findOne(id);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEvidenceDto]),
    __metadata("design:returntype", void 0)
], EvidenceController.prototype, "create", null);
__decorate([
    Get('user/:userId'),
    __param(0, Param('userId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvidenceController.prototype, "findByUser", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvidenceController.prototype, "findOne", null);
EvidenceController = __decorate([
    Controller('evidence'),
    __metadata("design:paramtypes", [EvidenceService])
], EvidenceController);
export { EvidenceController };
//# sourceMappingURL=evidence.controller.js.map