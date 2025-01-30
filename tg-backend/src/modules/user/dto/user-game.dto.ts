import { ApiProperty } from '@nestjs/swagger';

class GameResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the game' })
  id: number = 0;

  @ApiProperty({
    example: 'Super Mario Odyssey',
    description: 'The title of the game',
  })
  title: string = '';

  @ApiProperty({
    example: null,
    description: 'The description of the game',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    example: 'Nintendo Switch',
    description: 'The platform of the game',
  })
  platform: string = '';

  @ApiProperty({ example: 'Plataforma', description: 'The genre of the game' })
  genre: string = '';

  @ApiProperty({ example: '249.99', description: 'The price of the game' })
  price: number = 0;

  @ApiProperty({
    example: false,
    description: 'Indicates if the game is available for trade',
  })
  forTrade: boolean = false;

  @ApiProperty({
    example: null,
    description: 'The cover image of the game',
    nullable: true,
  })
  images?: string[];

  @ApiProperty({
    example: '8aed5909-da95-4a17-bf37-af685a52b623',
    description: 'The ID of the game owner',
  })
  ownerId: string = '';
}

export class UserWithGamesResponseDto {
  @ApiProperty({
    example: '8aed5909-da95-4a17-bf37-af685a52b623',
    description: 'The ID of the user',
  })
  id: string = '';

  @ApiProperty({
    example: 'Ze das cabras',
    description: 'The name of the user',
  })
  name: string = '';

  @ApiProperty({
    example: 'ze@gmail.com',
    description: 'The email of the user',
  })
  email: string = '';

  @ApiProperty({
    example: '',
    description: 'The profile picture of the user',
    nullable: true,
  })
  profilePicture?: string | null;

  @ApiProperty({
    example: 'rsrs',
    description: 'The bio of the user',
    nullable: true,
  })
  bio?: string | null;

  @ApiProperty({
    type: [GameResponseDto],
    description: 'The list of games associated with the user',
  })
  games: GameResponseDto[] = [];
}

export class UserWithoutGamesResponseDto {
  @ApiProperty({
    example: '8aed5909-da95-4a17-bf37-af685a52b623',
    description: 'The ID of the user',
  })
  id: string = '';

  @ApiProperty({
    example: 'Ze das cabras',
    description: 'The name of the user',
  })
  name: string = '';

  @ApiProperty({
    example: 'ze@gmail.com',
    description: 'The email of the user',
  })
  email: string = '';

  @ApiProperty({
    example: '',
    description: 'The profile picture of the user',
    nullable: true,
  })
  profilePicture?: string | null;

  @ApiProperty({
    example: 'rsrs',
    description: 'The bio of the user',
    nullable: true,
  })
  bio?: string | null;
}
