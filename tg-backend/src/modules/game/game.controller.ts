import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  CreateGameDto,
  CreateGameResponseDto,
  PaginatedGameResponseDto,
} from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Games')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Register a new game' })
  @ApiResponse({
    status: 201,
    description: 'Game created successfully.',
    type: CreateGameResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Owner not found.' })
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createGameDto: CreateGameDto,
  ) {
    return this.gameService.create(createGameDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all registered games' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'platform', required: false, type: String })
  @ApiQuery({ name: 'genre', required: false, type: String })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns all found games or an empty array [].',
    type: PaginatedGameResponseDto,
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('platform') platform?: string,
    @Query('genre') genre?: string,
    @Query('title') title?: string,
  ) {
    return this.gameService.findAll(+page, +limit, platform, genre, title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a game by this id.',
    type: CreateGameResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a game data' })
  @ApiResponse({
    status: 200,
    description: 'Returns the new game data updated.',
    type: CreateGameResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.update(+id, updateGameDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game data' })
  @ApiResponse({
    status: 200,
    description: 'The game has been deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.gameService.remove(+id, req.user.id);
  }
}
