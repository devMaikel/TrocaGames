import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, profilePicture, bio } = createUserDto;
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await hash(password, 8);
    const userData: any = { name, email, password: hashedPassword };
    if (profilePicture) userData.profilePicture = profilePicture;
    if (bio) userData.bio = bio;
    await this.prisma.user.create({
      data: userData,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        bio: true,
      },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        bio: true,
        games: {
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
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        bio: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const userWithSameEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
        select: {
          id: true,
        },
      });

      if (userWithSameEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    const hashedPassword = await hash(
      updateUserDto.password || user.password,
      8,
    );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name || user.name,
        email: updateUserDto.email || user.email,
        password: updateUserDto.password || user.password,
        profilePicture: updateUserDto.profilePicture || user.profilePicture,
        bio: updateUserDto.bio || user.bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        bio: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await prisma.game.updateMany({
        where: { ownerId: id },
        data: { deletedAt: new Date() },
      });

      return {
        message: 'User and associated games has been deleted successfully',
      };
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
  }
}
