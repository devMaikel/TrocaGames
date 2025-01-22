import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from '@nestjs/class-validator';
import { GameGenre, Platform } from 'src/utils/enum';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(Platform, { message: 'Plataforma inválida' })
  platform: Platform;

  @IsNotEmpty()
  @IsEnum(GameGenre, { message: 'Gênero inválido' })
  genre: GameGenre;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  forTrade?: boolean;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
