import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMessageDto, MessageResponseDto } from './dto/message.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Send a message in an existing chat.',
    description:
      'Sends a new message in the specified chat. The authenticated user must be either the buyer or the seller in the chat.',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the sent message.',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Chat not found.' })
  @ApiResponse({
    status: 400,
    description: 'User is not a participant in the chat.',
  })
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<MessageResponseDto> {
    return this.messageService.sendMessage(createMessageDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('chat/:chatId')
  @ApiOperation({
    summary: 'Retrieve messages from a chat.',
    description:
      'Fetches all messages from a specific chat. The authenticated user must be either the buyer or the seller in the chat.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of messages in the chat.',
    type: [MessageResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Chat not found.' })
  @ApiResponse({
    status: 400,
    description: 'User is not a participant in the chat.',
  })
  async getMessagesByChat(
    @Param('chatId') chatId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: AuthenticatedRequest,
  ): Promise<{
    data: MessageResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    return this.messageService.getMessagesByChat(
      +chatId,
      +page,
      +limit,
      req.user.id,
    );
  }
}
