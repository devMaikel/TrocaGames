import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @ApiProperty({
    example: 'joao.silva@example.com',
    description: 'Endereço de e-mail do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário (mínimo de 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string = '';

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

export class EmailConflictResponseDto {
  @ApiProperty({
    example: 'Email already in use',
    description: 'Mensagem de erro',
  })
  message: string = '';

  @ApiProperty({
    example: 'Conflict',
    description: 'Tipo de erro',
  })
  error: string = '';

  @ApiProperty({
    example: 409,
    description: 'Código de status HTTP',
  })
  statusCode: number = 409;
}
