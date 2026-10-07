import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Match } from './match.entity';
import { UserRole, Platform } from './types';
export * from './types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: Platform,
    default: Platform.PS5,
  })
  platform: Platform;

  @Column({ nullable: true })
  konamiId?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @Column({ default: 'Division 2' })
  division: string;

  @Column({ default: 0 })
  matchesPlayed: number;

  @Column({ default: 0 })
  matchesWon: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  winRate: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;

  @OneToMany(() => Match, (match) => match.creator)
  createdMatches: Match[];

  @OneToMany(() => Match, (match) => match.opponent)
  acceptedMatches: Match[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
