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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Ratings controller
 * Handles HTTP requests for star ratings on movies and comics
 */
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  /**
   * Create or update a rating
   * @param user Current authenticated user
   * @param createDto Rating data
   * @returns Created or updated rating
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdate(
    @CurrentUser() user: any,
    @Body() createDto: CreateRatingDto,
  ) {
    return this.ratingsService.createOrUpdate(user.userId, createDto);
  }

  /**
   * Get rating statistics for content (public endpoint)
   * @param contentType Content type
   * @param contentId Content ID
   * @returns Rating statistics
   */
  @Get('content')
  async getContentRating(
    @Query('contentType') contentType: 'movie' | 'comic',
    @Query('contentId') contentId: string,
  ) {
    return this.ratingsService.getContentRating(contentType, contentId);
  }

  /**
   * Get user's rating for content
   * @param user Current authenticated user
   * @param contentType Content type
   * @param contentId Content ID
   * @returns User's rating or null
   */
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserRating(
    @CurrentUser() user: any,
    @Query('contentType') contentType: 'movie' | 'comic',
    @Query('contentId') contentId: string,
  ) {
    return this.ratingsService.getUserRating(user.userId, contentType, contentId);
  }

  /**
   * Delete a rating
   * @param user Current authenticated user
   * @param contentType Content type
   * @param contentId Content ID
   * @returns Success status
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteRating(
    @CurrentUser() user: any,
    @Query('contentType') contentType: 'movie' | 'comic',
    @Query('contentId') contentId: string,
  ) {
    await this.ratingsService.deleteRating(user.userId, contentType, contentId);
    return { message: 'Rating deleted successfully' };
  }
}
