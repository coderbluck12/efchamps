import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Tournament,
  TournamentStatus,
} from '../../entities/tournament.entity';
import { TournamentParticipant } from '../../entities/tournament-participant.entity';
import { User, Platform } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '../../entities/transaction.entity';
import {
  CreateTournamentDto,
  JoinTournamentDto,
} from './dto/tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentParticipant)
    private readonly participantRepository: Repository<TournamentParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async getTournaments(status?: TournamentStatus) {
    const query = this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.host', 'host')
      .leftJoinAndSelect('tournament.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .orderBy('tournament.createdAt', 'DESC');

    if (status) {
      query.where('tournament.status = :status', { status });
    }

    return query.getMany();
  }

  async getTournamentById(id: string) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
      relations: ['host', 'participants', 'participants.user'],
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    return tournament;
  }

  async createTournament(userId: string, dto: CreateTournamentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const host = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!host || !host.wallet) {
        throw new NotFoundException('Host not found');
      }

      if (Number(host.wallet.availableBalance) < Number(dto.stakePerPlayer)) {
        throw new BadRequestException('Insufficient balance to lock host tournament stake');
      }

      // Lock host stake
      host.wallet.availableBalance =
        Number(host.wallet.availableBalance) - Number(dto.stakePerPlayer);
      host.wallet.escrowLockedBalance =
        Number(host.wallet.escrowLockedBalance) + Number(dto.stakePerPlayer);
      await queryRunner.manager.save(host.wallet);

      const totalPrizePool = Number(dto.stakePerPlayer) * dto.maxPlayers;

      const tournament = queryRunner.manager.create(Tournament, {
        name: dto.name,
        host,
        maxPlayers: dto.maxPlayers,
        joinedPlayers: 1,
        stakePerPlayer: dto.stakePerPlayer,
        totalPrizePool,
        format: dto.format || 'Single elimination',
        gameMode: dto.gameMode || 'Dream Team',
        platform: dto.platform || Platform.PS5,
        status: TournamentStatus.OPEN,
      });

      const savedTournament = await queryRunner.manager.save(tournament);

      const participant = queryRunner.manager.create(TournamentParticipant, {
        tournament: savedTournament,
        user: host,
        seedSlot: 1,
        selectedTeam: 'Manchester City',
        stakeLocked: true,
      });

      await queryRunner.manager.save(participant);

      const tx = queryRunner.manager.create(Transaction, {
        wallet: host.wallet,
        type: TransactionType.STAKE_LOCKED,
        amount: dto.stakePerPlayer,
        status: TransactionStatus.ESCROW,
        description: `Host entry for tournament "${dto.name}"`,
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();
      return savedTournament;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async joinTournament(userId: string, tournamentId: string, dto: JoinTournamentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tournament = await queryRunner.manager.findOne(Tournament, {
        where: { id: tournamentId },
        relations: ['participants', 'participants.user'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }

      if (tournament.joinedPlayers >= tournament.maxPlayers) {
        throw new BadRequestException('Tournament bracket is completely full');
      }

      const alreadyJoined = tournament.participants.some(
        (p) => p.user.id === userId,
      );
      if (alreadyJoined) {
        throw new BadRequestException('You have already entered this tournament');
      }

      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['wallet'],
      });

      if (!user || !user.wallet) {
        throw new NotFoundException('User not found');
      }

      if (Number(user.wallet.availableBalance) < Number(tournament.stakePerPlayer)) {
        throw new BadRequestException('Insufficient balance for tournament buy-in');
      }

      // Lock user stake
      user.wallet.availableBalance =
        Number(user.wallet.availableBalance) - Number(tournament.stakePerPlayer);
      user.wallet.escrowLockedBalance =
        Number(user.wallet.escrowLockedBalance) + Number(tournament.stakePerPlayer);
      await queryRunner.manager.save(user.wallet);

      const participant = queryRunner.manager.create(TournamentParticipant, {
        tournament,
        user,
        seedSlot: tournament.joinedPlayers + 1,
        selectedTeam: dto.selectedTeam || 'Real Madrid',
        stakeLocked: true,
      });
      await queryRunner.manager.save(participant);

      tournament.joinedPlayers += 1;
      if (tournament.joinedPlayers >= tournament.maxPlayers) {
        tournament.status = TournamentStatus.STARTING;
      }
      await queryRunner.manager.save(tournament);

      const tx = queryRunner.manager.create(Transaction, {
        wallet: user.wallet,
        type: TransactionType.STAKE_LOCKED,
        amount: tournament.stakePerPlayer,
        status: TransactionStatus.ESCROW,
        description: `Entry into tournament "${tournament.name}"`,
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();
      return this.getTournamentById(tournament.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
