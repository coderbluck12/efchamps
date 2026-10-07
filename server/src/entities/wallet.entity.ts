import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  availableBalance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  escrowLockedBalance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  lifetimeWinnings: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 300.0 })
  monthlyLimit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  monthlyUsed: number;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
