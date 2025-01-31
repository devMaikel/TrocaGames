import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatResponseDto, CreateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(
    createChatDto: CreateChatDto,
    authUserId: string,
  ): Promise<ChatResponseDto> {
    const { gameId } = createChatDto;

    const game = await this.prisma.game.findUnique({
      where: { id: gameId, deletedAt: null },
    });
    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    if (game.ownerId === authUserId) {
      throw new BadRequestException(
        'User cannot create a chat for their own game.',
      );
    }

    const chat = await this.prisma.chat.create({
      data: {
        gameId,
        buyerId: authUserId,
        sellerId: game.ownerId,
      },
    });

    return chat;
  }

  async getChatsByUser(userId: string): Promise<ChatResponseDto[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        game: { select: { title: true, platform: true, price: true } },
        buyer: { select: { name: true } },
        seller: { select: { name: true } },
        messages: {
          select: { sender: { select: { name: true } }, content: true },
        },
      },
    });

    return chats;
  }
}
