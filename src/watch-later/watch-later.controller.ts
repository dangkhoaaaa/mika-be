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
import { WatchLaterService } from './watch-later.service';
import { CreateWatchLaterDto } from './dto/create-watch-later.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * WatchLater controller
 * Handles HTTP requests for user's watch later list
 */
@Controller('watch-later')
@UseGuards(JwtAuthGuard)
export class WatchLaterController {
  constructor(private readonly watchLaterService: WatchLaterService) {}

  /**
   * Add a content to watch later
   * @param user Current authenticated user
   * @param createDto Watch later data
   * @returns Created watch later entry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addWatchLater(
    @CurrentUser() user: any,
    @Body() createDto: CreateWatchLaterDto,
  ) {
    return this.watchLaterService.addWatchLater(user.userId, createDto);
  }

  /**
   * Get user's watch later list
   * @param user Current authenticated user
   * @param contentType Optional filter by content type
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated watch later list
   */
  @Get()
  async getWatchLater(
    @CurrentUser() user: any,
    @Query('contentType') contentType?: 'movie' | 'comic',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.watchLaterService.getUserWatchLater(
      user.userId,
      contentType,
      parseInt(page),
      parseInt(limit),
    );
  }

  /**
   * Check if a content is in watch later
   * @param user Current authenticated user
   * @param contentId Content ID
   * @returns Boolean indicating if content is in watch later
   */
  @Get('check/:contentId')
  async checkWatchLater(
    @CurrentUser() user: any,
    @Param('contentId') contentId: string,
  ) {
    const isInWatchLater = await this.watchLaterService.isInWatchLater(user.userId, contentId);
    return { isInWatchLater };
  }

  /**
   * Remove a content from watch later
   * @param user Current authenticated user
   * @param contentId Content ID
   * @returns Success status
   */
  @Delete(':contentId')
  @HttpCode(HttpStatus.OK)
  async removeWatchLater(
    @CurrentUser() user: any,
    @Param('contentId') contentId: string,
  ) {
    await this.watchLaterService.removeWatchLater(user.userId, contentId);
    return { message: 'Removed from watch later successfully' };
  }

  /**
   * Clear all watch later
   * @param user Current authenticated user
   * @returns Success status
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearWatchLater(@CurrentUser() user: any) {
    const deletedCount = await this.watchLaterService.clearWatchLater(user.userId);
    return { message: `Removed ${deletedCount} watch later entries` };
  }
}

