import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Post('update-role')
  updateUserRole(@Body() body: { userId: string; role: string }) {
    return this.adminService.updateUserRole(body.userId, body.role);
  }

  @Post('cancel-match')
  cancelMatch(@Body('matchId') matchId: string) {
    return this.adminService.adminCancelMatch(matchId);
  }

  @Post('delete-match')
  deleteMatch(@Body('matchId') matchId: string) {
    return this.adminService.adminDeleteMatch(matchId);
  }

  @Post('cancel-tournament')
  cancelTournament(@Body('tournamentId') tournamentId: string) {
    return this.adminService.adminCancelTournament(tournamentId);
  }

  @Post('delete-tournament')
  deleteTournament(@Body('tournamentId') tournamentId: string) {
    return this.adminService.adminDeleteTournament(tournamentId);
  }
}
