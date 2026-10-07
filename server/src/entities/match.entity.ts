import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { MatchDispute } from './dispute.entity';
import { Platform, MatchStatus } from './types';
export * from './types';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.createdMatches, { eager: true })
  creator: User;

  @ManyToOne(() => User, (user) => user.acceptedMatches, { nullable: true, eager: true })
  opponent?: User;

  @Column({
    type: 'enum',
    enum: Platform,
    default: Platform.PS5,
  })
  platform: Platform;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  stakeAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  prizePool: number;

  @Column({ default: '1v1 • 10 min' })
  format: string;

  @Column({ default: 'Standard teams' })
  teamRules: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.OPEN,
  })
  status: MatchStatus;

  @Column({ nullable: true })
  creatorReportedScore?: string;

  @Column({ nullable: true })
  opponentReportedScore?: string;

  @ManyToOne(() => User, { nullable: true })
  winner?: User;

  @OneToOne(() => MatchDispute, (dispute) => dispute.match, { nullable: true })
  dispute?: MatchDispute;

  @Column({ nullable: true })
  lobbyCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
