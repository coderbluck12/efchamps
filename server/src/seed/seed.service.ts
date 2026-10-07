import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Platform } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import { Match, MatchStatus } from '../entities/match.entity';
import { Tournament, TournamentStatus } from '../entities/tournament.entity';
import { TournamentParticipant } from '../entities/tournament-participant.entity';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    @InjectRepository(Tournament)
    private readonly tournamentRepo: Repository<Tournament>,
    @InjectRepository(TournamentParticipant)
    private readonly participantRepo: Repository<TournamentParticipant>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async onApplicationBootstrap() {
    const matchCount = await this.matchRepo.count();
    if (matchCount > 0) {
      return; // Already populated
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Initial players
    const playersData = [
      { username: 'Mendoza10', email: 'mendoza@efchamps.com', platform: Platform.PS5, winRate: 94, matchesWon: 142, matchesPlayed: 151, winnings: 2840 },
      { username: 'GoalGhost', email: 'ghost@efchamps.com', platform: Platform.PC, winRate: 91, matchesWon: 118, matchesPlayed: 130, winnings: 2315 },
      { username: 'KairoFC', email: 'kairo@efchamps.com', platform: Platform.XBOX, winRate: 89, matchesWon: 98, matchesPlayed: 110, winnings: 1980 },
      { username: 'RicoNXT', email: 'rico@efchamps.com', platform: Platform.PS5, winRate: 87, matchesWon: 85, matchesPlayed: 98, winnings: 1642 },
      { username: 'VantaXI', email: 'vanta@efchamps.com', platform: Platform.MOBILE, winRate: 86, matchesWon: 74, matchesPlayed: 86, winnings: 1410 },
      { username: 'DrePrime', email: 'dre@efchamps.com', platform: Platform.MOBILE, winRate: 81, matchesWon: 60, matchesPlayed: 74, winnings: 920 },
      { username: 'AxelPro', email: 'axel@efchamps.com', platform: Platform.XBOX, winRate: 83, matchesWon: 66, matchesPlayed: 80, winnings: 1040 },
    ];

    const users: User[] = [];
    for (const p of playersData) {
      let existing = await this.userRepo.findOne({ where: { username: p.username } });
      if (!existing) {
        const wallet = this.walletRepo.create({
          availableBalance: 85.0,
          escrowLockedBalance: 25.0,
          lifetimeWinnings: p.winnings,
          monthlyLimit: 300.0,
          monthlyUsed: 120.0,
        });
        const u = this.userRepo.create({
          username: p.username,
          email: p.email,
          passwordHash,
          platform: p.platform,
          role: UserRole.PLAYER,
          division: 'Division 1',
          winRate: p.winRate,
          matchesWon: p.matchesWon,
          matchesPlayed: p.matchesPlayed,
          wallet,
        });
        const savedUser = await this.userRepo.save(u);
        existing = savedUser;

        const savedWallet = await this.walletRepo.findOne({ where: { user: { id: savedUser.id } } });
        if (savedWallet) {
          const tx = this.transactionRepo.create({
            wallet: savedWallet,
            type: TransactionType.PRIZE_WON,
            amount: 45.0,
            status: TransactionStatus.COMPLETED,
            description: 'Match win prize release',
          });
          await this.transactionRepo.save(tx);
        }
      }
      users.push(existing);
    }

    // Seed open live challenges
    if (users.length >= 4) {
      const openMatchesData = [
        { creator: users[3], stake: 10, prize: 18, platform: Platform.PS5, format: '1v1 • 8 min' },
        { creator: users[2], stake: 25, prize: 45, platform: Platform.XBOX, format: '1v1 • 10 min' },
        { creator: users[5], stake: 5, prize: 9, platform: Platform.MOBILE, format: '1v1 • 6 min' },
        { creator: users[1], stake: 50, prize: 90, platform: Platform.PC, format: '1v1 • 10 min' },
        { creator: users[4], stake: 15, prize: 27, platform: Platform.PS5, format: '1v1 • 8 min' },
        { creator: users[6], stake: 10, prize: 18, platform: Platform.XBOX, format: '1v1 • 8 min' },
      ];

      for (const m of openMatchesData) {
        const match = this.matchRepo.create({
          creator: m.creator,
          stakeAmount: m.stake,
          prizePool: m.prize,
          platform: m.platform,
          format: m.format,
          teamRules: 'Standard teams',
          status: MatchStatus.OPEN,
        });
        await this.matchRepo.save(match);
      }
    }

    // Seed tournaments
    const tournCount = await this.tournamentRepo.count();
    if (tournCount === 0 && users.length >= 2) {
      const t1 = this.tournamentRepo.create({
        name: 'Custom Knockout #108',
        host: users[0],
        maxPlayers: 8,
        joinedPlayers: 5,
        stakePerPlayer: 10,
        totalPrizePool: 80,
        platform: Platform.PS5,
        gameMode: 'Dream Team',
        status: TournamentStatus.OPEN,
      });
      const savedT1 = await this.tournamentRepo.save(t1);

      for (let i = 0; i < 5; i++) {
        const tp = this.participantRepo.create({
          tournament: savedT1,
          user: users[i],
          seedSlot: i + 1,
          selectedTeam: i === 0 ? 'Manchester United' : i === 1 ? 'Arsenal FC' : 'FC Barcelona',
          stakeLocked: true,
        });
        await this.participantRepo.save(tp);
      }

      const t2 = this.tournamentRepo.create({
        name: 'Weekend Winner Cup',
        host: users[1],
        maxPlayers: 32,
        joinedPlayers: 29,
        stakePerPlayer: 20,
        totalPrizePool: 640,
        platform: Platform.PS5,
        gameMode: 'Dream Team',
        status: TournamentStatus.OPEN,
      });
      await this.tournamentRepo.save(t2);
    }
  }
}
