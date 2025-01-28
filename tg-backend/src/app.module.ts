import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { GameModule } from './modules/game/game.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    GameModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
