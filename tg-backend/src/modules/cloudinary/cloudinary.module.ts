import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CloudinaryService, PrismaService],
  exports: [CloudinaryService],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
