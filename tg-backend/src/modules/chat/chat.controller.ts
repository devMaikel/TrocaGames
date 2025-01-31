import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatResponseDto, CreateChatDto } from './dto/chat.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Create a new chat with the game seller.',
    description:
      "Creates a new chat between the authenticated user (buyer) and the seller of the specified game. The buyerId is automatically set to the authenticated user's ID.",
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the newly created chat.',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @ApiResponse({
    status: 400,
    description: 'Forbidden. User cannot create a chat for their own game.',
  })
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChatResponseDto> {
    return this.chatService.createChat(createChatDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user')
  @ApiOperation({
    summary: 'Get all chats from authenticated user.',
    description:
      'Returns all chats where the authenticated user is either the buyer or the seller. The response includes details about the game, the buyer, the seller, and the messages.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of chats involving the authenticated user.',
    type: [ChatResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No chats found for the authenticated user.',
  })
  async getChatsByUser(
    @Req() req: AuthenticatedRequest,
  ): Promise<ChatResponseDto[]> {
    return this.chatService.getChatsByUser(req.user.id);
  }
}
