import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Match, MatchStatus } from '../../entities/match.entity';
import { MatchDispute } from '../../entities/dispute.entity';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/transaction.entity';
import { Tournament, TournamentStatus } from '../../entities/tournament.entity';
import { TournamentParticipant } from '../../entities/tournament-participant.entity';
import { Wallet } from '../../entities/wallet.entity';
import { PlatformSetting } from '../../entities/platform-setting.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(MatchDispute)
    private readonly disputeRepository: Repository<MatchDispute>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(PlatformSetting)
    private readonly platformSettingRepository: Repository<PlatformSetting>,
  ) {}

  async getOverviewStats() {
    const totalPlayers = await this.userRepository.count();
    const openDisputes = await this.disputeRepository.count();
    const liveMatches = await this.matchRepository.count({
      where: { status: MatchStatus.IN_PROGRESS },
    });
    const tournamentsCount = await this.tournamentRepository.count();

    const sumResult = await this.transactionRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'total')
      .getRawOne();

    // Calculate today's volume from real database transactions created today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySumResult = await this.transactionRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'todayTotal')
      .where('tx.createdAt >= :startOfToday', { startOfToday })
      .getRawOne();

    return {
      grossVolume: Number(sumResult?.total || 0),
      totalPlayers,
      openDisputes,
      liveMatches,
      tournamentsCount,
      healthy: true,
      todayVolume: Number(todaySumResult?.todayTotal || 0),
    };
  }

  async getTournaments() {
    return this.tournamentRepository.find({
      relations: ['host'],
      take: 50,
      order: { createdAt: 'DESC' },
    });
  }

  async getPlayers() {
    return this.userRepository.find({
      relations: ['wallet'],
      take: 50,
      order: { createdAt: 'DESC' },
    });
  }

  async getMatches() {
    return this.matchRepository.find({
      relations: ['creator', 'opponent'],
      take: 50,
      order: { createdAt: 'DESC' },
    });
  }

  async getDisputes() {
    return this.disputeRepository.find({
      relations: ['match', 'match.creator', 'match.opponent', 'raisedBy'],
      take: 50,
      order: { createdAt: 'DESC' },
    });
  }

  async getTransactions() {
    return this.transactionRepository.find({
      relations: ['wallet', 'wallet.user'],
      take: 50,
      order: { createdAt: 'DESC' },
    });
  }

  private static currentMatchDurationMinutes = 6;

  async getMatchDuration() {
    return { minutes: AdminService.currentMatchDurationMinutes };
  }

  async setMatchDuration(minutes: number) {
    AdminService.currentMatchDurationMinutes = minutes;
    await this.updatePlatformSetting('DEFAULT_MATCH_DURATION_MINUTES', String(minutes));
    return { minutes: AdminService.currentMatchDurationMinutes };
  }

  async getPlatformSettings() {
    const settings = await this.platformSettingRepository.find();
    const settingsMap: Record<string, string> = {
      PLATFORM_FEE_PERCENTAGE: '10',
      DISPUTE_IMAGE_RULES: 'Clear in-game final whistle screenshot or recording showing final score, Konami ID/PSN/Gamertag, and match stats. Uncropped, unedited JPG/PNG only.',
      DISPUTE_ACCEPTED_FORMATS: 'JPG, PNG, WEBP (Max 10MB per image)',
      DEFAULT_MATCH_DURATION_MINUTES: String(AdminService.currentMatchDurationMinutes),
      AUTO_FORFEIT_GRACE_MINUTES: '5',
    };

    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return settingsMap;
  }

  async updatePlatformSetting(key: string, value: string, description?: string) {
    let setting = await this.platformSettingRepository.findOne({ where: { key } });
    if (!setting) {
      setting = this.platformSettingRepository.create({ key, value, description });
    } else {
      setting.value = value;
      if (description) setting.description = description;
    }
    await this.platformSettingRepository.save(setting);
    return { [key]: value };
  }

  async resolveDispute(disputeId: string, winnerId: string, resolutionNotes?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dispute = await queryRunner.manager.findOne(MatchDispute, {
        where: { id: disputeId },
        relations: ['match', 'match.creator', 'match.creator.wallet', 'match.opponent', 'match.opponent.wallet'],
      });

      if (!dispute) {
        throw new NotFoundException('Dispute not found');
      }

      const match = dispute.match;
      if (!match) {
        throw new NotFoundException('Match associated with dispute not found');
      }

      if (match.status === MatchStatus.COMPLETED) {
        throw new BadRequestException('Match is already completed');
      }

      const winner = match.creator?.id === winnerId ? match.creator : match.opponent;
      const loser = match.creator?.id === winnerId ? match.opponent : match.creator;

      if (!winner || !loser) {
        throw new BadRequestException('Winner or loser cannot be determined from given winnerId');
      }

      // Unlock escrow balances
      winner.wallet.escrowLockedBalance = Math.max(
        0,
        Number(winner.wallet.escrowLockedBalance) - Number(match.stakeAmount),
      );
      loser.wallet.escrowLockedBalance = Math.max(
        0,
        Number(loser.wallet.escrowLockedBalance) - Number(match.stakeAmount),
      );

      // Award prize pool to winner
      winner.wallet.availableBalance =
        Number(winner.wallet.availableBalance) + Number(match.prizePool);

      // Update win stats
      winner.matchesPlayed = (winner.matchesPlayed || 0) + 1;
      winner.matchesWon = (winner.matchesWon || 0) + 1;
      winner.winRate = Math.round((winner.matchesWon / winner.matchesPlayed) * 100);

      loser.matchesPlayed = (loser.matchesPlayed || 0) + 1;
      loser.winRate = Math.round(((loser.matchesWon || 0) / loser.matchesPlayed) * 100);

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
        description: `Dispute Awarded: Match #${match.id.slice(0, 8)} vs ${loser.username}`,
      });
      await queryRunner.manager.save(prizeTx);

      match.status = MatchStatus.COMPLETED;
      match.winner = winner;
      await queryRunner.manager.save(match);

      dispute.status = 'RESOLVED' as any;
      dispute.resolutionNotes = resolutionNotes || `Resolved in favor of ${winner.username}`;
      await queryRunner.manager.save(dispute);

      await queryRunner.commitTransaction();
      return { message: 'Dispute successfully resolved', dispute, match };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserRole(userId: string, role: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role as any;
    return this.userRepository.save(user);
  }

  async adminCancelMatch(matchId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const match = await queryRunner.manager.findOne(Match, {
        where: { id: matchId },
        relations: ['creator', 'creator.wallet', 'opponent', 'opponent.wallet'],
      });

      if (!match) {
        throw new NotFoundException('Match not found');
      }

      if (match.status === MatchStatus.CANCELLED) {
        throw new BadRequestException('Match is already cancelled');
      }

      const stakeAmount = Number(match.stakeAmount || 0);

      // Refund creator if match wasn't already completed/refunded
      if (match.status !== MatchStatus.COMPLETED && match.creator?.wallet) {
        const creatorWallet = match.creator.wallet;
        creatorWallet.escrowLockedBalance = Math.max(
          0,
          Number(creatorWallet.escrowLockedBalance) - stakeAmount,
        );
        creatorWallet.availableBalance =
          Number(creatorWallet.availableBalance) + stakeAmount;
        await queryRunner.manager.save(creatorWallet);

        const refundTx = queryRunner.manager.create(Transaction, {
          wallet: creatorWallet,
          type: TransactionType.STAKE_REFUNDED,
          amount: stakeAmount,
          status: TransactionStatus.COMPLETED,
          description: `Admin Refund: Match #${match.id.slice(0, 8)} cancelled by admin`,
        });
        await queryRunner.manager.save(refundTx);
      }

      // Refund opponent if they had joined and match wasn't completed
      if (
        match.status !== MatchStatus.COMPLETED &&
        match.opponent &&
        match.opponent.wallet
      ) {
        const opponentWallet = match.opponent.wallet;
        opponentWallet.escrowLockedBalance = Math.max(
          0,
          Number(opponentWallet.escrowLockedBalance) - stakeAmount,
        );
        opponentWallet.availableBalance =
          Number(opponentWallet.availableBalance) + stakeAmount;
        await queryRunner.manager.save(opponentWallet);

        const refundTx = queryRunner.manager.create(Transaction, {
          wallet: opponentWallet,
          type: TransactionType.STAKE_REFUNDED,
          amount: stakeAmount,
          status: TransactionStatus.COMPLETED,
          description: `Admin Refund: Match #${match.id.slice(0, 8)} cancelled by admin`,
        });
        await queryRunner.manager.save(refundTx);
      }

      match.status = MatchStatus.CANCELLED;
      const cancelledMatch = await queryRunner.manager.save(match);

      await queryRunner.commitTransaction();
      return { message: 'Match successfully cancelled and stakes refunded', match: cancelledMatch };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async adminDeleteMatch(matchId: string) {
    // Delete match: cancel first to refund, then delete record
    await this.adminCancelMatch(matchId);
    await this.matchRepository.delete({ id: matchId });
    return { message: 'Match record permanently deleted' };
  }

  async adminCancelTournament(tournamentId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tournament = await queryRunner.manager.findOne(Tournament, {
        where: { id: tournamentId },
        relations: ['participants', 'participants.user', 'participants.user.wallet'],
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      if (tournament.status === TournamentStatus.CANCELLED) {
        throw new BadRequestException('Tournament is already cancelled');
      }

      const stakePerPlayer = Number(tournament.stakePerPlayer || 0);

      // Refund all participants if tournament was not completed
      if (tournament.status !== TournamentStatus.COMPLETED && tournament.participants) {
        for (const participant of tournament.participants) {
          const userWallet = participant.user?.wallet;
          if (userWallet && participant.stakeLocked) {
            userWallet.escrowLockedBalance = Math.max(
              0,
              Number(userWallet.escrowLockedBalance) - stakePerPlayer,
            );
            userWallet.availableBalance =
              Number(userWallet.availableBalance) + stakePerPlayer;
            await queryRunner.manager.save(userWallet);

            const refundTx = queryRunner.manager.create(Transaction, {
              wallet: userWallet,
              type: TransactionType.STAKE_REFUNDED,
              amount: stakePerPlayer,
              status: TransactionStatus.COMPLETED,
              description: `Admin Refund: Tournament "${tournament.name}" cancelled by admin`,
            });
            await queryRunner.manager.save(refundTx);
          }
        }
      }

      tournament.status = TournamentStatus.CANCELLED;
      const cancelledTournament = await queryRunner.manager.save(tournament);

      await queryRunner.commitTransaction();
      return {
        message: 'Tournament successfully cancelled and participant stakes refunded',
        tournament: cancelledTournament,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async adminDeleteTournament(tournamentId: string) {
    await this.adminCancelTournament(tournamentId);
    await this.tournamentRepository.delete({ id: tournamentId });
    return { message: 'Tournament record permanently deleted' };
  }
}
