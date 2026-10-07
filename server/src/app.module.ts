import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { Match } from './entities/match.entity';
import { MatchDispute } from './entities/dispute.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentParticipant } from './entities/tournament-participant.entity';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { MatchesModule } from './modules/matches/matches.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url,
          // Neon PostgreSQL requires SSL
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [
            User,
            Wallet,
            Transaction,
            Match,
            MatchDispute,
            Tournament,
            TournamentParticipant,
          ],
          synchronize: true, // Automatically synchronize database schema in development
          logging: config.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    AuthModule,
    WalletModule,
    MatchesModule,
    TournamentsModule,
    LeaderboardModule,
    AdminModule,
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Transaction,
      Match,
      MatchDispute,
      Tournament,
      TournamentParticipant,
    ]),
  ],
  providers: [SeedService],
})
export class AppModule {}
