import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { TournamentParticipant } from './tournament-participant.entity';
import { Platform, TournamentStatus } from './types';
export * from './types';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, { eager: true })
  host: User;

  @Column({ default: 8 })
  maxPlayers: number;

  @Column({ default: 1 })
  joinedPlayers: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  stakePerPlayer: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrizePool: number;

  @Column({ default: 'Single elimination' })
  format: string;

  @Column({ default: 'Dream Team' })
  gameMode: string;

  @Column({
    type: 'enum',
    enum: Platform,
    default: Platform.PS5,
  })
  platform: Platform;

  @Column({
    type: 'enum',
    enum: TournamentStatus,
    default: TournamentStatus.OPEN,
  })
  status: TournamentStatus;

  @OneToMany(() => TournamentParticipant, (tp) => tp.tournament, { cascade: true })
  participants: TournamentParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
