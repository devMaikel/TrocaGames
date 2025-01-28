import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
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
        { folder: 'uploads' }, // Pasta onde as imagens serão salvas
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new Error('Upload failed: No result from Cloudinary'),
            );
          }

          // Atualizar o perfil do usuário com a URL da imagem USANDO A FUNÇÃO LÁ DO SERVICE DE USER
          resolve(result.secure_url); // Retorna a URL da imagem
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
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' }, // Pasta onde as imagens serão salvas
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new Error('Upload failed: No result from Cloudinary'),
            );
          }
          // Atualizar o jogo com a URL da imagem USANDO A FUNÇÃO LÁ DO SERVICE DE GAME
          resolve(result.secure_url); // Retorna a URL da imagem
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
