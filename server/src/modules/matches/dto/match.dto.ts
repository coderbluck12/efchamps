import { IsNumber, IsPositive, IsEnum, IsOptional, IsString } from 'class-validator';
import { Platform } from '../../../entities/user.entity';

export class CreateMatchDto {
  @IsEnum(Platform)
  platform: Platform;

  @IsNumber()
  @IsPositive()
  stakeAmount: number;

  @IsString()
  @IsOptional()
  format?: string;

  @IsString()
  @IsOptional()
  teamRules?: string;
}

export class SubmitScoreDto {
  @IsString()
  score: string;

  @IsString()
  @IsOptional()
  outcome?: string; // 'WIN' | 'LOSS' | 'DRAW'
}

export class DisputeMatchDto {
  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  evidenceUrl?: string;
}
