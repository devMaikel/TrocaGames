import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'joao.silva@example.com',
    description: 'Endereço de e-mail do usuário',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'senha123',
    description: 'Senha do usuário (mínimo de 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    description: 'URL da foto de perfil do usuário',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({
    example: 'Oi, eu sou o João Silva!',
    description: 'Breve descrição sobre o usuário',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
