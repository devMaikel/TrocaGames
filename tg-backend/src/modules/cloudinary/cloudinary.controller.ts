import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadImageResponseDto } from './dto/upload.dto';

@ApiTags('Images')
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('image/profile')
  @ApiOperation({ summary: 'Upload a new profile image to authenticated user' })
  @ApiResponse({
    status: 201,
    description: 'Upload completed successfully.',
    type: UploadImageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Upload file not found.' })
  @ApiResponse({
    status: 400,
    description: 'File type is not supported. (accepts: .jpg, .jpeg, .png)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      throw new BadRequestException(
        'File type is not supported. (accepts: .jpg, .jpeg, .png)',
      );
    const imageUrl = await this.cloudinaryService.uploadProfileImage(
      file,
      req.user.id,
    );
    return {
      message: 'Upload completed successfully!',
      url: imageUrl,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('image/game/:id')
  @ApiOperation({
    summary: 'Upload a new cover image to a authenticated user game',
  })
  @ApiResponse({
    status: 201,
    description: 'Upload completed successfully.',
    type: UploadImageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Upload file not found.' })
  @ApiResponse({
    status: 400,
    description: 'File type is not supported. (accepts: .jpg, .jpeg, .png)',
  })
  @ApiResponse({
    status: 400,
    description: 'Game not found.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadGameImage(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (!file || !file.originalname.match(/\.(jpg|jpeg|png)$/))
      throw new BadRequestException(
        'File type is not supported. (accepts: .jpg, .jpeg, .png)',
      );
    const imageUrl = await this.cloudinaryService.uploadGameImage(
      file,
      req.user.id,
      +id,
    );
    return {
      message: 'Upload completed successfully!',
      url: imageUrl,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('image/game/:id/remove')
  @ApiOperation({
    summary: 'Remove an image from a authenticated user game',
  })
  @ApiResponse({
    status: 200,
    description: 'Image removed successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Game not found or the provided URL does not correspond to an image stored for this game.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeGameImage(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    await this.cloudinaryService.removeGameImage(req.user.id, +id, imageUrl);
    return {
      message: 'Image removed successfully!',
    };
  }
}
