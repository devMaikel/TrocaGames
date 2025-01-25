import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async create(createGameDto: CreateGameDto, userId: string) {
    const { title, description, platform, genre, price, forTrade, coverImage } =
      createGameDto;

    const owner = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const gameData: any = {
      title,
      platform,
      genre,
      price,
      forTrade,
      ownerId: userId,
    };
    if (description !== undefined) gameData.description = description;
    if (coverImage !== undefined) gameData.coverImage = coverImage;

    const game = await this.prisma.game.create({
      data: gameData,
    });

    return game;
  }

  async findAll() {
    return await this.prisma.game.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        description: true,
        platform: true,
        genre: true,
        price: true,
        forTrade: true,
        coverImage: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id: id, deletedAt: null },
      select: {
        id: true,
        title: true,
        description: true,
        platform: true,
        genre: true,
        price: true,
        forTrade: true,
        coverImage: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
