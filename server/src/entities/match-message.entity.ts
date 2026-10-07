import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Match } from './match.entity';
import { User } from './user.entity';

@Entity('match_messages')
export class MatchMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  match: Match;

  @ManyToOne(() => User, { eager: true })
  sender: User;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
