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
    return await this.prisma.user.findMany({ where: { deletedAt: null } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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

      return { message: 'User and associated games soft deleted successfully' };
    });
  }
}
