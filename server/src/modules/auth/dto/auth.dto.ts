import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Platform } from '../../../entities/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Platform)
  @IsOptional()
  platform?: Platform;

  @IsString()
  @IsOptional()
  konamiId?: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  login: string; // username or email

  @IsString()
  @IsNotEmpty()
  password: string;
}
