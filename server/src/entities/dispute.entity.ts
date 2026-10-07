import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Match } from './match.entity';
import { User } from './user.entity';
import { DisputeStatus } from './types';
export * from './types';

@Entity('match_disputes')
export class MatchDispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Match, (match) => match.dispute, { onDelete: 'CASCADE' })
  @JoinColumn()
  match: Match;

  @ManyToOne(() => User)
  raisedBy: User;

  @Column()
  reason: string;

  @Column({ nullable: true })
  evidenceUrl?: string;

  @Column({ type: 'simple-array', nullable: true })
  evidenceUrls?: string[];

  @Column({ type: 'simple-array', nullable: true })
  creatorEvidenceUrls?: string[];

  @Column({ type: 'simple-array', nullable: true })
  opponentEvidenceUrls?: string[];

  @Column({ type: 'text', nullable: true })
  creatorReason?: string;

  @Column({ type: 'text', nullable: true })
  opponentReason?: string;

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.IN_REVIEW,
  })
  status: DisputeStatus;

  @Column({ nullable: true })
  resolutionNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
