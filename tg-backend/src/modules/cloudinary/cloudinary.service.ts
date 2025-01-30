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
    gameId: number,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Upload file not found.');
    }
    const gameToUpdate = await this.prisma.game.findUnique({
      where: { id: gameId, ownerId: userId },
      select: { images: true },
    });

    if (!gameToUpdate) {
      throw new NotFoundException('Game not found.');
    }

    if (gameToUpdate.images.length >= 5) {
      throw new BadRequestException('Maximum number of images reached.');
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

          const updatedImages = [...gameToUpdate.images, result.secure_url];

          await this.prisma.game.update({
            where: { id: gameId, ownerId: userId },
            data: { images: updatedImages },
          });

          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async removeGameImage(
    userId: string,
    gameId: number,
    imageUrl: string,
  ): Promise<void> {
    const gameToUpdate = await this.prisma.game.findUnique({
      where: { id: gameId, ownerId: userId },
    });

    if (!gameToUpdate) {
      throw new NotFoundException('Game not found.');
    }

    if (!gameToUpdate.images.includes(imageUrl)) {
      throw new BadRequestException(
        'The provided URL does not correspond to an image stored for this game.',
      );
    }

    const updatedImages = gameToUpdate.images.filter((img) => img !== imageUrl);

    await this.prisma.game.update({
      where: { id: gameId, ownerId: userId },
      data: { images: updatedImages },
    });

    const publicId = imageUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`uploads/games/${publicId}`);
    }
  }
}
