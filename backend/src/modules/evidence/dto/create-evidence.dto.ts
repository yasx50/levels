
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  EvidenceType,
  Visibility,
} 
 from '@prisma/client';

export class CreateEvidenceDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  userSkillId?: string;

  @IsEnum(EvidenceType)
  type: EvidenceType;

  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  fileUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  organization?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
