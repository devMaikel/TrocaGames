import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './modules/user/user.module';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [UserModule, GameModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
