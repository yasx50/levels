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
import { Body, Controller, Delete, Get, Param, Post, } from '@nestjs/common';
import { UserSkillsService } from './user-skills.service.js';
import { AssignSkillDto } from './dto/assign-skill.dto.js';
let UserSkillsController = class UserSkillsController {
    userSkillsService;
    constructor(userSkillsService) {
        this.userSkillsService = userSkillsService;
    }
    assignSkill(dto) {
        return this.userSkillsService.assignSkill(dto);
    }
    findUserSkills(userId) {
        return this.userSkillsService.findUserSkills(userId);
    }
    removeSkill(userId, skillId) {
        return this.userSkillsService.removeSkill(userId, skillId);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssignSkillDto]),
    __metadata("design:returntype", void 0)
], UserSkillsController.prototype, "assignSkill", null);
__decorate([
    Get(':userId'),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserSkillsController.prototype, "findUserSkills", null);
__decorate([
    Delete(':userId/:skillId'),
    __param(0, Param('userId')),
    __param(1, Param('skillId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserSkillsController.prototype, "removeSkill", null);
UserSkillsController = __decorate([
    Controller('user-skills'),
    __metadata("design:paramtypes", [UserSkillsService])
], UserSkillsController);
export { UserSkillsController };
//# sourceMappingURL=user-skills.controller.js.map