import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class VerifyPaystackDto {
  @IsString()
  reference: string;
}

export class WithdrawDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  destination?: string;
}
