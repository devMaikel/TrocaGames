import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGameDto {
  @ApiPropertyOptional({
    description: 'Título do jogo',
    example: 'The Legend of Zelda',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição do jogo',
    example: 'Um jogo de aventura épico.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Plataforma do jogo',
    example: 'Nintendo Switch',
  })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional({
    description: 'Gênero do jogo',
    example: 'Ação e Aventura',
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({ description: 'Preço do jogo', example: 299.99 })
  @IsNumber()
  @IsOptional()
  price?: string;

  @ApiPropertyOptional({ description: 'Disponível para troca', example: false })
  @IsBoolean()
  @IsOptional()
  forTrade?: boolean;

  @ApiPropertyOptional({
    description: 'URL da imagem de capa',
    example: 'https://example.com/zelda.jpg',
  })
  @IsString()
  @IsOptional()
  coverImage?: string;
}
