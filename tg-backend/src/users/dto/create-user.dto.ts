import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from '@nestjs/class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: 'A biografia deve ser uma string' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'A URL da foto de perfil deve ser uma string' })
  profilePicture?: string;
}
