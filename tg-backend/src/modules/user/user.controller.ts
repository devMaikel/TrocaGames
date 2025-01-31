import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, EmailConflictResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserWithGamesResponseDto,
  UserWithoutGamesResponseDto,
} from './dto/user-game.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email is already in use.',
    type: EmailConflictResponseDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all users' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns all users data without the associated games.',
  //   type: [UserWithoutGamesResponseDto],
  // })
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user data and associated games.',
    type: UserWithGamesResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  @ApiOperation({ summary: 'Update authenticated user data' })
  @ApiResponse({
    status: 200,
    description: 'User data updated successfully.',
    type: UserWithoutGamesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use.',
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  @ApiOperation({ summary: 'Delete a authenticated user from the system' })
  @ApiResponse({
    status: 200,
    description: 'User and associated games has been deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  remove(@Req() req: AuthenticatedRequest) {
    return this.userService.remove(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Returns authenticated user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user data.',
    type: UserWithGamesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  getAuthUser(@Req() req: AuthenticatedRequest) {
    return this.userService.findOne(req.user.id);
  }
}
