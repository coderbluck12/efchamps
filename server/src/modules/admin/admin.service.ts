import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Match, MatchStatus } from '../../entities/match.entity';
import { MatchDispute } from '../../entities/dispute.entity';
import { Transaction } from '../../entities/transaction.entity';
import { Tournament } from '../../entities/tournament.entity';

@Injectable()
export class AdminService {
  constructor(
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
      throw new Error('User not found');
    }
    user.role = role as any;
    return this.userRepository.save(user);
  }
}
