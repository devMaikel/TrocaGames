// src/chat/dto/create-chat.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  gameId: number = 0;
}

export class ChatResponseDto {
  @ApiProperty()
  id: number = 0;

  @ApiProperty()
  gameId: number = 0;

  @ApiProperty()
  buyerId: string = '';

  @ApiProperty()
  sellerId: string = '';

  @ApiProperty()
  createdAt: Date = new Date();

  @ApiProperty()
  updatedAt: Date = new Date();
}
