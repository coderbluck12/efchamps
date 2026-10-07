import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketStatus } from '../../entities/support-ticket.entity';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  createTicket(
    @Request() req: any,
    @Body() dto: { subject: string; category?: string; message: string; matchId?: string },
  ) {
    return this.supportService.createTicket(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tickets')
  getMyTickets(@Request() req: any) {
    return this.supportService.getMyTickets(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-tickets')
  getAllTickets(@Request() req: any) {
    // Admin check is also handled at service or guard level
    return this.supportService.getAllTickets();
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets/:id/respond')
  respondToTicket(
    @Param('id') id: string,
    @Body() body: { adminResponse: string; status?: TicketStatus },
  ) {
    return this.supportService.respondToTicket(id, body.adminResponse, body.status);
  }
}
