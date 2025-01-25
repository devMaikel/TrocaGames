import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string = '';

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string = '';
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token for authenticated requests',
  })
  access_token: string = '';
}
