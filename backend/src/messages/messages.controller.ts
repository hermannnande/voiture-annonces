import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateThreadDto, SendMessageDto } from './dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('threads')
  async getThreads(@CurrentUser() user: User) {
    return this.messagesService.getThreads(user.id, user.role);
  }

  @Get('threads/:id')
  async getThreadById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.messagesService.getThreadById(id, user.id, user.role);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.messagesService.getUnreadCount(userId);
  }

  @Post('threads')
  async createThread(@CurrentUser('id') userId: string, @Body() dto: CreateThreadDto) {
    return this.messagesService.createThread(userId, dto.listingId, dto.message);
  }

  @Post('threads/:id/messages')
  async sendMessage(
    @Param('id') threadId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(threadId, userId, dto.body);
  }
}





