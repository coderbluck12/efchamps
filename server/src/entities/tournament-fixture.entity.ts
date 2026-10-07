import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { User } from './user.entity';

export enum BracketRound {
  QUARTER_FINALS = 'QUARTER_FINALS',
  SEMI_FINALS = 'SEMI_FINALS',
  FINALS = 'FINALS',
}

export enum FixtureStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  WALKOVER = 'WALKOVER',
}

@Entity('tournament_fixtures')
export class TournamentFixture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @Column({
    type: 'enum',
    enum: BracketRound,
    default: BracketRound.QUARTER_FINALS,
  })
  round: BracketRound;

  @Column({ default: 1 })
  matchNumber: number;

  @ManyToOne(() => User, { nullable: true, eager: true })
  player1: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  player2: User;

  @Column({ nullable: true })
  player1Score: number;

  @Column({ nullable: true })
  player2Score: number;

  @ManyToOne(() => User, { nullable: true, eager: true })
  winner: User;

  @Column({
    type: 'enum',
    enum: FixtureStatus,
    default: FixtureStatus.SCHEDULED,
  })
  status: FixtureStatus;

  @Column({ nullable: true })
  nextFixtureId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
