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
      relations: ['match', 'raisedBy'],
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
    return { minutes: AdminService.currentMatchDurationMinutes };
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
