import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Match, MatchStatus } from '../../entities/match.entity';
import { User } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '../../entities/transaction.entity';
import {
  MatchDispute,
  DisputeStatus,
} from '../../entities/dispute.entity';
import { PlatformSetting } from '../../entities/platform-setting.entity';
import {
  CreateMatchDto,
  SubmitScoreDto,
  DisputeMatchDto,
} from './dto/match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MatchDispute)
    private readonly disputeRepository: Repository<MatchDispute>,
    @InjectRepository(PlatformSetting)
    private readonly platformSettingRepository: Repository<PlatformSetting>,
    private readonly dataSource: DataSource,
  ) {}

  async getOpenMatches() {
    return this.matchRepository.find({
      where: { status: MatchStatus.OPEN },
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMyActiveMatches(userId: string) {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.creator', 'creator')
      .leftJoinAndSelect('match.opponent', 'opponent')
      .where('(match.creator.id = :userId OR match.opponent.id = :userId)', {
        userId,
      })
      .andWhere('match.status IN (:...statuses)', {
        statuses: [
          MatchStatus.ACCEPTED,
          MatchStatus.IN_PROGRESS,
          MatchStatus.RESULT_PENDING,
          MatchStatus.DISPUTED,
        ],
      })
      .getMany();
  }

  async createMatch(userId: string, dto: CreateMatchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const creator = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!creator || !creator.wallet) {
        throw new NotFoundException('Creator not found');
      }

      // Ensure creator does not already have an active 1v1 match in progress
      const existingActive = await queryRunner.manager
        .createQueryBuilder(Match, 'm')
        .where('(m.creator.id = :userId OR m.opponent.id = :userId)', { userId })
        .andWhere('m.status IN (:...activeStatuses)', {
          activeStatuses: [
            MatchStatus.ACCEPTED,
            MatchStatus.IN_PROGRESS,
            MatchStatus.RESULT_PENDING,
          ],
        })
        .getOne();

      if (existingActive) {
        throw new BadRequestException(
          'You already have an active match in progress. Please complete it before creating a new challenge.'
        );
      }

      if (Number(creator.wallet.availableBalance) < Number(dto.stakeAmount)) {
        throw new BadRequestException('Insufficient available balance to lock stake');
      }

      // Move funds to escrow
      creator.wallet.availableBalance =
        Number(creator.wallet.availableBalance) - Number(dto.stakeAmount);
      creator.wallet.escrowLockedBalance =
        Number(creator.wallet.escrowLockedBalance) + Number(dto.stakeAmount);
      await queryRunner.manager.save(creator.wallet);

      const tx = queryRunner.manager.create(Transaction, {
        wallet: creator.wallet,
        type: TransactionType.STAKE_LOCKED,
        amount: dto.stakeAmount,
        status: TransactionStatus.ESCROW,
        description: `Stake locked for open match creation`,
      });
      await queryRunner.manager.save(tx);

      // Calculate prize pool dynamically from platform fee percentage (default 10% rake)
      let feePercent = 10;
      try {
        const feeSetting = await queryRunner.manager.findOne(PlatformSetting, {
          where: { key: 'PLATFORM_FEE_PERCENTAGE' },
        });
        if (feeSetting && !isNaN(Number(feeSetting.value))) {
          feePercent = Number(feeSetting.value);
        }
      } catch (e) {
        // Fallback to default
      }

      // Total stake is 2 * stakeAmount. Platform takes feePercent / 100, winner gets the rest.
      const totalCombinedStake = Number(dto.stakeAmount) * 2;
      const rakeMultiplier = (100 - feePercent) / 100;
      const prizePool = totalCombinedStake * rakeMultiplier;

      const match = queryRunner.manager.create(Match, {
        creator,
        platform: dto.platform,
        stakeAmount: dto.stakeAmount,
        prizePool,
        format: dto.format || '1v1 • 10 min',
        teamRules: dto.teamRules || 'Standard teams',
        status: MatchStatus.OPEN,
      });

      const savedMatch = await queryRunner.manager.save(match);
      await queryRunner.commitTransaction();

      return savedMatch;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getMatchById(matchId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(matchId);
    if (!isUuid) {
      throw new NotFoundException('Match not found');
    }
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['creator', 'opponent', 'winner', 'dispute'],
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  async acceptMatch(userId: string, matchId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(matchId);
    if (!isUuid) {
      throw new NotFoundException('Match not found');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const match = await queryRunner.manager.findOne(Match, {
        where: { id: matchId },
        relations: ['creator'],
      });

      if (!match) {
        throw new NotFoundException('Match not found');
      }

      if (match.status !== MatchStatus.OPEN) {
        throw new BadRequestException('Match is no longer open');
      }

      if (match.creator.id === userId) {
        throw new BadRequestException('Cannot accept your own challenge');
      }

      // Ensure user does not already have an active 1v1 match
      const existingActiveMatch = await queryRunner.manager
        .createQueryBuilder(Match, 'm')
        .where('(m.creator.id = :userId OR m.opponent.id = :userId)', { userId })
        .andWhere('m.status IN (:...activeStatuses)', {
          activeStatuses: [
            MatchStatus.ACCEPTED,
            MatchStatus.IN_PROGRESS,
            MatchStatus.RESULT_PENDING,
          ],
        })
        .getOne();

      if (existingActiveMatch) {
        throw new BadRequestException(
          'You already have an active match in progress. Please finish it before joining another challenge.'
        );
      }

      const opponent = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!opponent || !opponent.wallet) {
        throw new NotFoundException('Player not found');
      }

      if (Number(opponent.wallet.availableBalance) < Number(match.stakeAmount)) {
        throw new BadRequestException('Insufficient balance to accept challenge');
      }

      // Lock opponent stake
      opponent.wallet.availableBalance =
        Number(opponent.wallet.availableBalance) - Number(match.stakeAmount);
      opponent.wallet.escrowLockedBalance =
        Number(opponent.wallet.escrowLockedBalance) + Number(match.stakeAmount);
      await queryRunner.manager.save(opponent.wallet);

      const tx = queryRunner.manager.create(Transaction, {
        wallet: opponent.wallet,
        type: TransactionType.STAKE_LOCKED,
        amount: match.stakeAmount,
        status: TransactionStatus.ESCROW,
        description: `Stake locked for match #${match.id.slice(0, 8)}`,
      });
      await queryRunner.manager.save(tx);

      match.opponent = opponent;
      match.status = MatchStatus.IN_PROGRESS;
      match.startedAt = new Date();
      const updatedMatch = await queryRunner.manager.save(match);

      await queryRunner.commitTransaction();
      return updatedMatch;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async submitScore(userId: string, matchId: string, dto: SubmitScoreDto) {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['creator', 'opponent'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.creator.id === userId) {
      match.creatorReportedScore = dto.score;
    } else if (match.opponent?.id === userId) {
      match.opponentReportedScore = dto.score;
    } else {
      throw new BadRequestException('You are not a participant in this match');
    }

    match.status = MatchStatus.RESULT_PENDING;

    // If both players submitted scores:
    if (match.creatorReportedScore && match.opponentReportedScore) {
      // Helper to parse submission format: either "goals:OUTCOME" or "c1-c2"
      const parseEntry = (entry: string) => {
        if (entry.includes(':')) {
          const [goalsStr, outcome] = entry.split(':');
          return { goals: Number(goalsStr), outcome: outcome.toUpperCase() };
        } else if (entry.includes('-')) {
          const [s1, s2] = entry.split('-').map(Number);
          const outcome = s1 > s2 ? 'WON' : s2 > s1 ? 'LOST' : 'DRAW';
          return { goals: s1, outcome };
        }
        return { goals: 0, outcome: 'UNKNOWN' };
      };

      const cData = parseEntry(match.creatorReportedScore);
      const oData = parseEntry(match.opponentReportedScore);

      // Consensus check:
      // Creator WON <-> Opponent LOST
      // Creator LOST <-> Opponent WON
      // Creator DRAW <-> Opponent DRAW
      let isConsensus = false;
      let winnerId: string | null = null;

      if (cData.outcome === 'WON' && oData.outcome === 'LOST') {
        isConsensus = true;
        winnerId = match.creator.id;
      } else if (cData.outcome === 'LOST' && oData.outcome === 'WON') {
        isConsensus = true;
        winnerId = match.opponent.id;
      } else if (cData.outcome === 'DRAW' && oData.outcome === 'DRAW') {
        isConsensus = true;
        winnerId = null; // Draw
      } else if (match.creatorReportedScore === match.opponentReportedScore) {
        // Fallback exact string match
        isConsensus = true;
        if (cData.goals > oData.goals) winnerId = match.creator.id;
        else if (oData.goals > cData.goals) winnerId = match.opponent.id;
      }

      if (isConsensus) {
        if (winnerId) {
          return this.settleMatch(match.id, winnerId);
        } else {
          // Draw -> refund both stakes
          match.status = MatchStatus.COMPLETED;
          return this.matchRepository.save(match);
        }
      } else {
        // Discrepancy -> trigger dispute
        match.status = MatchStatus.DISPUTED;
        await this.matchRepository.save(match);

        // Auto-create dispute record
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
          const dispute = this.disputeRepository.create({
            match,
            raisedBy: user,
            reason: `Conflicting match outcomes reported: Creator (${match.creatorReportedScore}) vs Opponent (${match.opponentReportedScore})`,
            status: DisputeStatus.IN_REVIEW,
          });
          await this.disputeRepository.save(dispute);
        }
        return match;
      }
    }

    return this.matchRepository.save(match);
  }

  async settleMatch(matchId: string, winnerId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const match = await queryRunner.manager.findOne(Match, {
        where: { id: matchId },
        relations: [
          'creator',
          'creator.wallet',
          'opponent',
          'opponent.wallet',
        ],
      });

      if (!match) {
        throw new NotFoundException('Match not found');
      }

      const winner = match.creator.id === winnerId ? match.creator : match.opponent;
      const loser = match.creator.id === winnerId ? match.opponent : match.creator;

      if (!winner || !loser) {
        throw new BadRequestException('Winner or loser cannot be determined');
      }

      // Unlock escrow balances
      winner.wallet.escrowLockedBalance =
        Number(winner.wallet.escrowLockedBalance) - Number(match.stakeAmount);
      loser.wallet.escrowLockedBalance =
        Number(loser.wallet.escrowLockedBalance) - Number(match.stakeAmount);

      // Award prize pool to winner
      winner.wallet.availableBalance =
        Number(winner.wallet.availableBalance) + Number(match.prizePool);
      winner.wallet.lifetimeWinnings =
        Number(winner.wallet.lifetimeWinnings) + Number(match.prizePool);

      // Update player win/match stats
      winner.matchesPlayed += 1;
      winner.matchesWon += 1;
      winner.winRate = Math.round((winner.matchesWon / winner.matchesPlayed) * 100);

      loser.matchesPlayed += 1;
      loser.winRate = Math.round((loser.matchesWon / loser.matchesPlayed) * 100);

      await queryRunner.manager.save(winner.wallet);
      await queryRunner.manager.save(loser.wallet);
      await queryRunner.manager.save(winner);
      await queryRunner.manager.save(loser);

      // Record winning transaction
      const prizeTx = queryRunner.manager.create(Transaction, {
        wallet: winner.wallet,
        type: TransactionType.PRIZE_WON,
        amount: match.prizePool,
        status: TransactionStatus.COMPLETED,
        description: `Won match against ${loser.username}`,
      });
      await queryRunner.manager.save(prizeTx);

      match.status = MatchStatus.COMPLETED;
      match.winner = winner;
      const finishedMatch = await queryRunner.manager.save(match);

      await queryRunner.commitTransaction();
      return finishedMatch;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async disputeMatch(userId: string, matchId: string, dto: DisputeMatchDto) {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['creator', 'opponent'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    match.status = MatchStatus.DISPUTED;
    await this.matchRepository.save(match);

    let dispute = await this.disputeRepository.findOne({
      where: { match: { id: matchId } },
      relations: ['match', 'raisedBy'],
    });

    const isCreator = match.creator?.id === userId;
    const isOpponent = match.opponent?.id === userId;

    const urls = dto.evidenceUrls && dto.evidenceUrls.length > 0 
      ? dto.evidenceUrls 
      : dto.evidenceUrl ? [dto.evidenceUrl] : [];

    if (!dispute) {
      dispute = this.disputeRepository.create({
        match,
        raisedBy: user,
        reason: dto.reason,
        evidenceUrl: urls[0] || undefined,
        evidenceUrls: urls,
        status: DisputeStatus.IN_REVIEW,
        creatorReason: isCreator ? dto.reason : undefined,
        opponentReason: isOpponent ? dto.reason : undefined,
        creatorEvidenceUrls: isCreator ? urls : [],
        opponentEvidenceUrls: isOpponent ? urls : [],
      });
    } else {
      // Append proof and reason to the respective player's evidence
      if (isCreator) {
        dispute.creatorReason = dto.reason;
        dispute.creatorEvidenceUrls = Array.from(new Set([...(dispute.creatorEvidenceUrls || []), ...urls]));
      } else if (isOpponent) {
        dispute.opponentReason = dto.reason;
        dispute.opponentEvidenceUrls = Array.from(new Set([...(dispute.opponentEvidenceUrls || []), ...urls]));
      }
      dispute.evidenceUrls = Array.from(new Set([...(dispute.evidenceUrls || []), ...urls]));
      dispute.status = DisputeStatus.IN_REVIEW;
    }

    return this.disputeRepository.save(dispute);
  }

  async setLobbyCode(userId: string, matchId: string, code: string) {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['creator', 'opponent'],
    });

    if (!match) throw new NotFoundException('Match not found');
    
    // Only creator is allowed to type/set the lobby code
    if (match.creator.id !== userId) {
      throw new BadRequestException('Only the match creator can set or update the lobby code');
    }

    match.lobbyCode = code;
    return this.matchRepository.save(match);
  }

  async cancelMatch(userId: string, matchId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(matchId);
    if (!isUuid) {
      throw new NotFoundException('Match not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const match = await queryRunner.manager.findOne(Match, {
        where: { id: matchId },
        relations: ['creator'],
      });

      if (!match) {
        throw new NotFoundException('Match not found');
      }

      if (match.creator.id !== userId) {
        throw new BadRequestException('Only the match creator can cancel this challenge');
      }

      if (match.status !== MatchStatus.OPEN) {
        throw new BadRequestException('Only open challenges can be cancelled. Once joined or in play, challenges cannot be cancelled.');
      }

      const creator = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!creator || !creator.wallet) {
        throw new NotFoundException('Creator wallet not found');
      }

      // Refund the creator's locked stake
      const refundAmount = Number(match.stakeAmount);
      creator.wallet.escrowLockedBalance = Math.max(
        0,
        Number(creator.wallet.escrowLockedBalance) - refundAmount,
      );
      creator.wallet.availableBalance =
        Number(creator.wallet.availableBalance) + refundAmount;
      await queryRunner.manager.save(creator.wallet);

      // Record refund transaction
      const refundTx = queryRunner.manager.create(Transaction, {
        wallet: creator.wallet,
        type: TransactionType.STAKE_REFUNDED,
        amount: refundAmount,
        status: TransactionStatus.COMPLETED,
        description: `Refund: Cancelled challenge (${match.format} • ${match.platform})`,
      });
      await queryRunner.manager.save(refundTx);

      match.status = MatchStatus.CANCELLED;
      const cancelledMatch = await queryRunner.manager.save(match);

      await queryRunner.commitTransaction();
      return { message: 'Challenge successfully cancelled and stake refunded to wallet', match: cancelledMatch };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

