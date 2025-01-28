import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({
    example: 'Upload completed successfully!',
    description: 'Mensagem de sucesso',
  })
  message: string = 'Upload completed successfully!';

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dgybgwn5w/image/upload/v1738081304/uploads/xdvyowevffqvm.jpg',
    description: 'Url da imagem',
  })
  url: string =
    'https://res.cloudinary.com/dgybgwn5w/image/upload/v1738081304/uploads/xdvyowevffqvm.jpg';
}
