import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MatchesService } from './matches.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  CreateMatchDto,
  SubmitScoreDto,
  DisputeMatchDto,
} from './dto/match.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('open')
  getOpenMatches() {
    return this.matchesService.getOpenMatches();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-active')
  getMyActiveMatches(@Request() req: any) {
    return this.matchesService.getMyActiveMatches(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createMatch(@Request() req: any, @Body() dto: CreateMatchDto) {
    return this.matchesService.createMatch(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  acceptMatch(@Request() req: any, @Param('id') matchId: string) {
    return this.matchesService.acceptMatch(req.user.sub, matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMatch(@Param('id') matchId: string) {
    return this.matchesService.getMatchById(matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/score')
  submitScore(
    @Request() req: any,
    @Param('id') matchId: string,
    @Body() dto: SubmitScoreDto,
  ) {
    return this.matchesService.submitScore(req.user.sub, matchId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/dispute')
  disputeMatch(
    @Request() req: any,
    @Param('id') matchId: string,
    @Body() dto: DisputeMatchDto,
  ) {
    return this.matchesService.disputeMatch(req.user.sub, matchId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/dispute/evidence')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadDisputeEvidence(
    @Request() req: any,
    @Param('id') matchId: string,
    @UploadedFiles() files: any[],
    @Body('reason') reason?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one evidence screenshot or photo is required');
    }

    const uploadedUrls = await this.cloudinaryService.uploadMultipleImages(files, 'efchamps/disputes');
    return this.matchesService.disputeMatch(req.user.sub, matchId, {
      reason: reason || 'Uploaded image evidence for dispute',
      evidenceUrls: uploadedUrls,
      evidenceUrl: uploadedUrls[0],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/lobby-code')
  setLobbyCode(
    @Request() req: any,
    @Param('id') matchId: string,
    @Body('code') code: string,
  ) {
    return this.matchesService.setLobbyCode(req.user.sub, matchId, code);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  cancelMatchPost(
    @Request() req: any,
    @Param('id') matchId: string,
  ) {
    return this.matchesService.cancelMatch(req.user.sub, matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  cancelMatchDelete(
    @Request() req: any,
    @Param('id') matchId: string,
  ) {
    return this.matchesService.cancelMatch(req.user.sub, matchId);
  }
}

