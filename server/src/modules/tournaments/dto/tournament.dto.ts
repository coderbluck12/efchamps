import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Platform } from '../../../entities/user.entity';

export class CreateTournamentDto {
  @IsString()
  name: string;

  @IsIn([8, 16, 32])
  maxPlayers: number;

  @IsNumber()
  @IsPositive()
  stakePerPlayer: number;

  @IsEnum(Platform)
  @IsOptional()
  platform?: Platform;

  @IsString()
  @IsOptional()
  format?: string;

  @IsString()
  @IsOptional()
  gameMode?: string;
}

export class JoinTournamentDto {
  @IsString()
  @IsOptional()
  selectedTeam?: string;
}
