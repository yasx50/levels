var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, } from 'class-validator';
import { EvidenceType, Visibility, } from '@prisma/client';
export class CreateEvidenceDto {
    userId;
    userSkillId;
    type;
    title;
    description;
    url;
    fileUrl;
    organization;
    startDate;
    endDate;
    visibility;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "userId", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "userSkillId", void 0);
__decorate([
    IsEnum(EvidenceType),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "type", void 0);
__decorate([
    IsString(),
    MaxLength(150),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(5000),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2048),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "url", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2048),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "fileUrl", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "organization", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "startDate", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "endDate", void 0);
__decorate([
    IsOptional(),
    IsEnum(Visibility),
    __metadata("design:type", String)
], CreateEvidenceDto.prototype, "visibility", void 0);
//# sourceMappingURL=create-evidence.dto.js.map