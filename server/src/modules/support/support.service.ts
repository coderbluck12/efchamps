import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus } from '../../entities/support-ticket.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTicket(
    userId: string,
    dto: { subject: string; category?: string; message: string; matchId?: string },
  ) {
    if (!dto.subject || !dto.message) {
      throw new BadRequestException('Subject and message are required');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ticket = this.ticketRepository.create({
      user,
      subject: dto.subject,
      category: dto.category || 'General',
      message: dto.message,
      matchId: dto.matchId,
      status: TicketStatus.OPEN,
    });

    return this.ticketRepository.save(ticket);
  }

  async getMyTickets(userId: string) {
    return this.ticketRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllTickets() {
    return this.ticketRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async respondToTicket(ticketId: string, adminResponse: string, status?: TicketStatus) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    ticket.adminResponse = adminResponse;
    if (status) {
      ticket.status = status;
    } else {
      ticket.status = TicketStatus.RESOLVED;
    }

    return this.ticketRepository.save(ticket);
  }
}
