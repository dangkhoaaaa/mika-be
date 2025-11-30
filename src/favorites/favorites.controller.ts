import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Favorites controller
 * Handles HTTP requests for user's favorite comics
 */
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * Add a comic to favorites
   * @param user Current authenticated user
   * @param createDto Favorite data
   * @returns Created favorite entry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @CurrentUser() user: any,
    @Body() createDto: CreateFavoriteDto,
  ) {
    return this.favoritesService.addFavorite(user.userId, createDto);
  }

  /**
   * Get user's favorites
   * @param user Current authenticated user
   * @param contentType Optional filter by content type
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated favorites list
   */
  @Get()
  async getFavorites(
    @CurrentUser() user: any,
    @Query('contentType') contentType?: 'movie' | 'comic',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.favoritesService.getUserFavorites(
      user.userId,
      contentType,
      parseInt(page),
      parseInt(limit),
    );
  }

  /**
   * Check if a comic is in favorites
   * @param user Current authenticated user
   * @param contentId Content ID
   * @returns Boolean indicating if comic is favorited
   */
  @Get('check/:contentId')
  async checkFavorite(
    @CurrentUser() user: any,
    @Param('contentId') contentId: string,
  ) {
    const isFavorite = await this.favoritesService.isFavorite(user.userId, contentId);
    return { isFavorite };
  }

  /**
   * Remove a comic from favorites
   * @param user Current authenticated user
   * @param contentId Content ID
   * @returns Success status
   */
  @Delete(':contentId')
  @HttpCode(HttpStatus.OK)
  async removeFavorite(
    @CurrentUser() user: any,
    @Param('contentId') contentId: string,
  ) {
    await this.favoritesService.removeFavorite(user.userId, contentId);
    return { message: 'Removed from favorites successfully' };
  }

  /**
   * Clear all favorites
   * @param user Current authenticated user
   * @returns Success status
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearFavorites(@CurrentUser() user: any) {
    const deletedCount = await this.favoritesService.clearFavorites(user.userId);
    return { message: `Removed ${deletedCount} favorites` };
  }
}
