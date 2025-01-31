import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @IsInt()
  chatId: number = 0;

  @IsString()
  content: string = '';
}

export class MessageResponseDto {
  @ApiProperty()
  id: number = 0;

  @ApiProperty()
  chatId: number = 0;

  @ApiProperty()
  senderId: string = '';

  @ApiProperty()
  content: string = '';

  @ApiProperty()
  createdAt: Date = new Date();
}
