import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Watch history controller
 * Handles HTTP requests for user viewing history
 */
@Controller('watch-history')
@UseGuards(JwtAuthGuard)
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  /**
   * Create or update watch history entry
   * @param user Current authenticated user
   * @param createDto Watch history data
   * @returns Created or updated watch history entry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdate(
    @CurrentUser() user: any,
    @Body() createDto: CreateWatchHistoryDto,
  ) {
    return this.watchHistoryService.createOrUpdate(user.userId, createDto);
  }

  /**
   * Get user's watch history
   * @param user Current authenticated user
   * @param contentType Optional filter by content type (movie/comic)
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated watch history list
   */
  @Get()
  async getWatchHistory(
    @CurrentUser() user: any,
    @Query('contentType') contentType?: 'movie' | 'comic',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.watchHistoryService.getUserWatchHistory(
      user.userId,
      contentType,
      parseInt(page),
      parseInt(limit),
    );
  }

  /**
   * Get specific watch history entry
   * @param user Current authenticated user
   * @param contentId Content ID
   * @returns Watch history entry
   */
  @Get(':contentId')
  async getWatchHistoryByContentId(
    @CurrentUser() user: any,
    @Param('contentId') contentId: string,
  ) {
    return this.watchHistoryService.getWatchHistory(user.userId, contentId);
  }

  /**
   * Update watch history entry
   * @param user Current authenticated user
   * @param contentId Content ID
   * @param updateDto Update data
   * @returns Updated watch history entry
   */
  @Put(':contentId')
  async updateWatchHistory(
    @CurrentUser() user: any,
    @Param('contentId') contentId: string,
    @Body() updateDto: UpdateWatchHistoryDto,
  ) {
    return this.watchHistoryService.updateWatchHistory(user.userId, contentId, updateDto);
  }

  /**
   * Delete watch history entry
   * @param user Current authenticated user
   * @param contentId Content ID
   * @returns Success status
   */
  @Delete(':contentId')
  @HttpCode(HttpStatus.OK)
  async deleteWatchHistory(
    @CurrentUser() user: any,
    @Param('contentId') contentId: string,
  ) {
    await this.watchHistoryService.deleteWatchHistory(user.userId, contentId);
    return { message: 'Watch history deleted successfully' };
  }

  /**
   * Clear all watch history
   * @param user Current authenticated user
   * @param contentType Optional filter by content type
   * @returns Success status
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearWatchHistory(
    @CurrentUser() user: any,
    @Query('contentType') contentType?: 'movie' | 'comic',
  ) {
    const deletedCount = await this.watchHistoryService.clearWatchHistory(user.userId, contentType);
    return { message: `Deleted ${deletedCount} watch history entries` };
  }
}
