var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, } from 'class-validator';
export class AssignSkillDto {
    userId;
    skillId;
    yearsExperience;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AssignSkillDto.prototype, "userId", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AssignSkillDto.prototype, "skillId", void 0);
__decorate([
    IsOptional(),
    IsNumber({ maxDecimalPlaces: 1 }),
    Min(0),
    Max(99.9),
    __metadata("design:type", Number)
], AssignSkillDto.prototype, "yearsExperience", void 0);
//# sourceMappingURL=assign-skill.dto.js.map