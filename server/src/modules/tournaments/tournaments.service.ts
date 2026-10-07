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
  TournamentFixture,
  BracketRound,
  FixtureStatus,
} from '../../entities/tournament-fixture.entity';
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
    @InjectRepository(TournamentFixture)
    private readonly fixtureRepository: Repository<TournamentFixture>,
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
      const isFull = tournament.joinedPlayers >= tournament.maxPlayers;
      if (isFull) {
        tournament.status = TournamentStatus.LIVE;
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

      // If full, generate the knockout bracket fixtures
      if (isFull) {
        const allParticipants = await queryRunner.manager.find(TournamentParticipant, {
          where: { tournament: { id: tournament.id } },
          relations: ['user'],
          order: { seedSlot: 'ASC' },
        });

        // 8-player bracket: 4 Quarter-Finals -> 2 Semi-Finals -> 1 Final
        // Round 1: Quarter Finals
        const qf1 = queryRunner.manager.create(TournamentFixture, {
          tournament,
          round: BracketRound.QUARTER_FINALS,
          matchNumber: 1,
          player1: allParticipants[0]?.user,
          player2: allParticipants[1]?.user,
          status: FixtureStatus.SCHEDULED,
        });
        const qf2 = queryRunner.manager.create(TournamentFixture, {
          tournament,
          round: BracketRound.QUARTER_FINALS,
          matchNumber: 2,
          player1: allParticipants[2]?.user,
          player2: allParticipants[3]?.user,
          status: FixtureStatus.SCHEDULED,
        });
        const qf3 = queryRunner.manager.create(TournamentFixture, {
          tournament,
          round: BracketRound.QUARTER_FINALS,
          matchNumber: 3,
          player1: allParticipants[4]?.user,
          player2: allParticipants[5]?.user,
          status: FixtureStatus.SCHEDULED,
        });
        const qf4 = queryRunner.manager.create(TournamentFixture, {
          tournament,
          round: BracketRound.QUARTER_FINALS,
          matchNumber: 4,
          player1: allParticipants[6]?.user,
          player2: allParticipants[7]?.user,
          status: FixtureStatus.SCHEDULED,
        });

        // Semi-Finals (awaiting QF winners)
        const sf1 = queryRunner.manager.create(TournamentFixture, {
          tournament,
          round: BracketRound.SEMI_FINALS,
          matchNumber: 1,
          status: FixtureStatus.SCHEDULED,
        });
        const sf2 = queryRunner.manager.create(TournamentFixture, {
          tournament,
          round: BracketRound.SEMI_FINALS,
          matchNumber: 2,
          status: FixtureStatus.SCHEDULED,
        });

        // Final
        const finalMatch = queryRunner.manager.create(TournamentFixture, {
          tournament,
          round: BracketRound.FINALS,
          matchNumber: 1,
          status: FixtureStatus.SCHEDULED,
        });

        await queryRunner.manager.save([qf1, qf2, qf3, qf4, sf1, sf2, finalMatch]);
      }

      await queryRunner.commitTransaction();
      return this.getTournamentById(tournament.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getTournamentFixtures(tournamentId: string) {
    let fixtures = await this.fixtureRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: ['player1', 'player2', 'winner'],
      order: { round: 'ASC', matchNumber: 'ASC' },
    });

    // If tournament has started or has participants but no fixtures generated yet, auto-generate initial fixture structure
    if (fixtures.length === 0) {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: tournamentId },
        relations: ['participants', 'participants.user'],
      });

      if (tournament && tournament.participants?.length >= 2) {
        const sorted = [...tournament.participants].sort((a, b) => a.seedSlot - b.seedSlot);
        const pairs = [];
        for (let i = 0; i < 4; i++) {
          pairs.push(
            this.fixtureRepository.create({
              tournament,
              round: BracketRound.QUARTER_FINALS,
              matchNumber: i + 1,
              player1: sorted[i * 2]?.user || null,
              player2: sorted[i * 2 + 1]?.user || null,
              status: sorted[i * 2] && sorted[i * 2 + 1] ? FixtureStatus.SCHEDULED : FixtureStatus.SCHEDULED,
            }),
          );
        }
        pairs.push(
          this.fixtureRepository.create({
            tournament,
            round: BracketRound.SEMI_FINALS,
            matchNumber: 1,
            status: FixtureStatus.SCHEDULED,
          }),
          this.fixtureRepository.create({
            tournament,
            round: BracketRound.SEMI_FINALS,
            matchNumber: 2,
            status: FixtureStatus.SCHEDULED,
          }),
          this.fixtureRepository.create({
            tournament,
            round: BracketRound.FINALS,
            matchNumber: 1,
            status: FixtureStatus.SCHEDULED,
          }),
        );
        fixtures = await this.fixtureRepository.save(pairs);
      }
    }

    return fixtures;
  }

  async submitFixtureResult(userId: string, fixtureId: string, player1Score: number, player2Score: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fixture = await queryRunner.manager.findOne(TournamentFixture, {
        where: { id: fixtureId },
        relations: ['tournament', 'player1', 'player2'],
      });

      if (!fixture) {
        throw new NotFoundException('Fixture not found');
      }

      if (fixture.player1?.id !== userId && fixture.player2?.id !== userId) {
        throw new BadRequestException('Only participating players can report fixture score');
      }

      if (fixture.status === FixtureStatus.COMPLETED) {
        throw new BadRequestException('Fixture already finalized');
      }

      fixture.player1Score = player1Score;
      fixture.player2Score = player2Score;
      const winner = player1Score > player2Score ? fixture.player1 : fixture.player2;
      fixture.winner = winner;
      fixture.status = FixtureStatus.COMPLETED;
      await queryRunner.manager.save(fixture);

      // Advance winner to subsequent round
      if (fixture.round === BracketRound.QUARTER_FINALS) {
        const sfMatchNumber = fixture.matchNumber <= 2 ? 1 : 2;
        const sf = await queryRunner.manager.findOne(TournamentFixture, {
          where: {
            tournament: { id: fixture.tournament.id },
            round: BracketRound.SEMI_FINALS,
            matchNumber: sfMatchNumber,
          },
        });
        if (sf) {
          if (fixture.matchNumber % 2 === 1) {
            sf.player1 = winner;
          } else {
            sf.player2 = winner;
          }
          await queryRunner.manager.save(sf);
        }
      } else if (fixture.round === BracketRound.SEMI_FINALS) {
        const finalMatch = await queryRunner.manager.findOne(TournamentFixture, {
          where: {
            tournament: { id: fixture.tournament.id },
            round: BracketRound.FINALS,
            matchNumber: 1,
          },
        });
        if (finalMatch) {
          if (fixture.matchNumber === 1) {
            finalMatch.player1 = winner;
          } else {
            finalMatch.player2 = winner;
          }
          await queryRunner.manager.save(finalMatch);
        }
      } else if (fixture.round === BracketRound.FINALS) {
        // Tournament completed! Award prize pool to winner
        const tournament = await queryRunner.manager.findOne(Tournament, {
          where: { id: fixture.tournament.id },
          relations: ['participants', 'participants.user', 'participants.user.wallet'],
        });

        if (tournament) {
          tournament.status = TournamentStatus.COMPLETED;
          await queryRunner.manager.save(tournament);

          const winnerUser = await queryRunner.manager.findOne(User, {
            where: { id: winner.id },
            relations: ['wallet'],
          });

          if (winnerUser && winnerUser.wallet) {
            // Deduct rake (e.g. 10%)
            const totalPool = Number(tournament.totalPrizePool);
            const prizeNet = totalPool * 0.9;

            winnerUser.wallet.availableBalance = Number(winnerUser.wallet.availableBalance) + prizeNet;
            winnerUser.wallet.lifetimeWinnings = Number(winnerUser.wallet.lifetimeWinnings) + prizeNet;
            await queryRunner.manager.save(winnerUser.wallet);

            const tx = queryRunner.manager.create(Transaction, {
              wallet: winnerUser.wallet,
              type: TransactionType.PRIZE_WON,
              amount: prizeNet,
              status: TransactionStatus.COMPLETED,
              description: `Grand Champion: Won tournament "${tournament.name}" (₦${prizeNet.toLocaleString()})`,
            });
            await queryRunner.manager.save(tx);
          }
        }
      }

      await queryRunner.commitTransaction();
      return this.getTournamentFixtures(fixture.tournament.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
