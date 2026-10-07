import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Platform } from '../../entities/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getLeaderboard(platform?: Platform) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .orderBy('user.winRate', 'DESC')
      .addOrderBy('user.matchesWon', 'DESC')
      .take(50);

    if (platform) {
      query.where('user.platform = :platform', { platform });
    }

    const users = await query.getMany();
    return users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      username: u.username,
      platform: u.platform,
      division: u.division,
      winRate: `${u.winRate}%`,
      matchesWon: u.matchesWon,
      matchesPlayed: u.matchesPlayed,
      lifetimeWinnings: `₦${Number(u.wallet?.lifetimeWinnings || 0).toLocaleString()}`,
    }));
  }
}
