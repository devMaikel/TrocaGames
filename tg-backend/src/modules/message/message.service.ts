import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto, MessageResponseDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(
    createMessageDto: CreateMessageDto,
    authUserId: string,
  ): Promise<MessageResponseDto> {
    const { chatId, content } = createMessageDto;

    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }
    if (chat.buyerId != authUserId && chat.sellerId != authUserId) {
      throw new BadRequestException('User is not a participant in the chat.');
    }

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId: authUserId,
        content,
      },
    });

    return message;
  }

  async getMessagesByChat(
    chatId: number,
    page: number = 1,
    limit: number = 10,
    authUserId: string,
  ): Promise<{
    data: MessageResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }
    if (chat.buyerId != authUserId && chat.sellerId != authUserId) {
      throw new BadRequestException('User is not a participant in the chat.');
    }
    const skip = (page - 1) * limit;

    const total = await this.prisma.message.count({ where: { chatId } });

    const messages = await this.prisma.message.findMany({
      where: { chatId },
      include: {
        sender: { select: { name: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    return {
      data: messages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
