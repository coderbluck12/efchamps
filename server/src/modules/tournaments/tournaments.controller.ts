import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import {
  CreateTournamentDto,
  JoinTournamentDto,
} from './dto/tournament.dto';
import { TournamentStatus } from '../../entities/tournament.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  getTournaments(@Query('status') status?: TournamentStatus) {
    return this.tournamentsService.getTournaments(status);
  }

  @Get(':id')
  getTournamentById(@Param('id') id: string) {
    return this.tournamentsService.getTournamentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTournament(@Request() req: any, @Body() dto: CreateTournamentDto) {
    return this.tournamentsService.createTournament(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  joinTournament(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: JoinTournamentDto,
  ) {
    return this.tournamentsService.joinTournament(req.user.sub, id, dto);
  }

  @Get(':id/fixtures')
  getTournamentFixtures(@Param('id') id: string) {
    return this.tournamentsService.getTournamentFixtures(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('fixtures/:fixtureId/score')
  submitFixtureScore(
    @Request() req: any,
    @Param('fixtureId') fixtureId: string,
    @Body() body: { player1Score: number; player2Score: number },
  ) {
    return this.tournamentsService.submitFixtureResult(
      req.user.sub,
      fixtureId,
      Number(body.player1Score),
      Number(body.player2Score),
    );
  }
}

