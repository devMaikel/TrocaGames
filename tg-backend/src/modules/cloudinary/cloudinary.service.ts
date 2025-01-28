import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadProfileImage(file: Express.Multer.File, userId): Promise<string> {
    if (!file) {
      throw new BadRequestException('Upload file not found.');
    }
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads/profiles' },
        async (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new Error('Upload failed: No result from Cloudinary'),
            );
          }
          await this.prisma.user.update({
            where: { id: userId },
            data: { profilePicture: result.secure_url },
          });
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async uploadGameImage(
    file: Express.Multer.File,
    userId: string,
    id: number,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Upload file not found.');
    }
    const gameToUpdate = await this.prisma.game.findUnique({
      where: { id: id, ownerId: userId },
    });
    if (!gameToUpdate) {
      throw new NotFoundException('Game not found.');
    }
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads/games' },
        async (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new Error('Upload failed: No result from Cloudinary'),
            );
          }
          await this.prisma.game.update({
            where: { id: id, ownerId: userId },
            data: { coverImage: result.secure_url },
          });
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
