import {
  BadRequestException,
  Controller,
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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadImageResponseDto } from './dto/upload.dto';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('image/profile')
  @ApiOperation({ summary: 'Upload a new image' })
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
  @Post('image/profile')
  @ApiOperation({ summary: 'Upload a new image' })
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
  async uploadGameImage(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
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
}
