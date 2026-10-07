import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Match } from '../../entities/match.entity';
import { MatchDispute } from '../../entities/dispute.entity';
import { Transaction } from '../../entities/transaction.entity';
import { Tournament } from '../../entities/tournament.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Match,
      MatchDispute,
      Transaction,
      Tournament,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
