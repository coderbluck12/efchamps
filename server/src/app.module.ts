import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { Match } from './entities/match.entity';
import { MatchDispute } from './entities/dispute.entity';
import { Tournament } from './entities/tournament.entity';
import { PlatformSetting } from './entities/platform-setting.entity';
import { TournamentParticipant } from './entities/tournament-participant.entity';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { MatchesModule } from './modules/matches/matches.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { AdminModule } from './modules/admin/admin.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
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
        const host = config.get<string>('DATABASE_HOST');
        const port = Number(config.get<number>('DATABASE_PORT')) || 5432;
        const username = config.get<string>('DATABASE_USER') || config.get<string>('DATABASE_USERNAME');
        const password = config.get<string>('DATABASE_PASSWORD');
        const database = config.get<string>('DATABASE_NAME') || config.get<string>('DATABASE_DB');

        const isLocalOrDocker = host === 'postgres' || host === 'localhost' || (url && (url.includes('localhost') || url.includes('postgres')));

        return {
          type: 'postgres',
          ...(url
            ? { url }
            : {
                host: host || 'postgres',
                port,
                username: username || 'efchamps',
                password: password || 'efchamps_secure_password_2026',
                database: database || 'efchamps_db',
              }),
          ssl: isLocalOrDocker
            ? false
            : {
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
            PlatformSetting,
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
    CloudinaryModule,
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Transaction,
      Match,
      MatchDispute,
      Tournament,
      TournamentParticipant,
      PlatformSetting,
    ]),
  ],
  providers: [SeedService],
})
export class AppModule {}
