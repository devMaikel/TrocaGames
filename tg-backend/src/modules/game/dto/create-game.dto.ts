import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGameDto {
  @ApiProperty({
    description: 'Título do jogo',
    example: 'The Legend of Zelda',
  })
  @IsString()
  @IsNotEmpty()
  title: string = '';

  @ApiPropertyOptional({
    description: 'Descrição do jogo',
    example: 'Um jogo de aventura épico.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Plataforma do jogo',
    example: 'Nintendo Switch',
  })
  @IsString()
  @IsNotEmpty()
  platform?: string;

  @ApiProperty({ description: 'Gênero do jogo', example: 'Ação e Aventura' })
  @IsString()
  @IsNotEmpty()
  genre: string = '';

  @ApiProperty({ description: 'Preço do jogo', example: 299.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number = 0;

  @ApiProperty({ description: 'Disponível para troca', example: false })
  @IsBoolean()
  @IsNotEmpty()
  forTrade: boolean = false;

  @ApiPropertyOptional({
    description: 'URL da imagem de capa',
    example: 'https://example.com/zelda.jpg',
  })
  @IsString()
  @IsOptional()
  images?: string[];
}

export class CreateGameResponseDto {
  @ApiProperty({ example: 1, description: 'ID do jogo' })
  id: number = 0;

  @ApiProperty({
    example: 'Super Mario Odyssey',
    description: 'Título do jogo',
  })
  title: string = '';

  @ApiProperty({
    example: 'Um jogo de plataforma incrível.',
    description: 'Descrição do jogo',
    nullable: true,
  })
  description: string | null = '';

  @ApiProperty({
    example: 'Nintendo Switch',
    description: 'Plataforma do jogo',
  })
  platform: string = '';

  @ApiProperty({ example: 'Plataforma', description: 'Gênero do jogo' })
  genre: string = '';

  @ApiProperty({ example: '249.99', description: 'Preço do jogo' })
  price: string = '';

  @ApiProperty({ example: false, description: 'Disponível para troca' })
  forTrade: boolean = false;

  @ApiProperty({
    example: 'https://example.com/mario.jpg',
    description: 'URL da imagem de capa',
    nullable: true,
  })
  images: string[] | null = [];

  @ApiProperty({
    example: '2025-01-25T02:04:37.613Z',
    description: 'Data de criação do jogo',
  })
  createdAt: string = '';

  @ApiProperty({
    example: '2025-01-25T02:04:37.613Z',
    description: 'Data de atualização do jogo',
    nullable: true,
  })
  updatedAt: string | null = '';

  @ApiProperty({
    example: '8aed5909-da95-4a17-bf37-af685a52b623',
    description: 'ID do dono do jogo',
  })
  ownerId: string = '';
}
