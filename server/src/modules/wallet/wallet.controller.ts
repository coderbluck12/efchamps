import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto, WithdrawDto } from './dto/wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  getWallet(@Request() req: any) {
    return this.walletService.getWalletByUserId(req.user.sub);
  }

  @Post('deposit')
  deposit(@Request() req: any, @Body() dto: DepositDto) {
    return this.walletService.deposit(req.user.sub, dto);
  }

  @Post('verify-paystack')
  verifyPaystack(@Request() req: any, @Body() dto: { reference: string }) {
    return this.walletService.verifyPaystack(req.user.sub, dto.reference);
  }

  @Post('withdraw')
  withdraw(@Request() req: any, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(req.user.sub, dto);
  }

  @Get('transactions')
  getTransactions(@Request() req: any) {
    return this.walletService.getTransactions(req.user.sub);
  }
}
