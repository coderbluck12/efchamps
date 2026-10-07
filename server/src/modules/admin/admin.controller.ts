import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  getOverview() {
    return this.adminService.getOverviewStats();
  }

  @Get('players')
  getPlayers() {
    return this.adminService.getPlayers();
  }

  @Get('matches')
  getMatches() {
    return this.adminService.getMatches();
  }

  @Get('disputes')
  getDisputes() {
    return this.adminService.getDisputes();
  }

  @Get('transactions')
  getTransactions() {
    return this.adminService.getTransactions();
  }

  @Get('tournaments')
  getTournaments() {
    return this.adminService.getTournaments();
  }

  @Get('match-duration')
  getMatchDuration() {
    return this.adminService.getMatchDuration();
  }

  @Post('match-duration')
  setMatchDuration(@Body('minutes') minutes: number) {
    return this.adminService.setMatchDuration(Number(minutes) || 6);
  }
}
