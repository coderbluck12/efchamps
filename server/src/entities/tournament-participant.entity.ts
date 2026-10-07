import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { User } from './user.entity';

@Entity('tournament_participants')
export class TournamentParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.participants, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ default: 1 })
  seedSlot: number;

  @Column({ default: 'Manchester City' })
  selectedTeam: string;

  @Column({ default: true })
  stakeLocked: boolean;

  @CreateDateColumn()
  joinedAt: Date;
}
