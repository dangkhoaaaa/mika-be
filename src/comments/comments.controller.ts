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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Comments controller
 * Handles HTTP requests for comments on movies and comics
 */
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Create a new comment
   * @param user Current authenticated user
   * @param createDto Comment data
   * @returns Created comment
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: any,
    @Body() createDto: CreateCommentDto,
  ) {
    return this.commentsService.create(user.userId, createDto);
  }

  /**
   * Get comments for content (public endpoint)
   * @param contentType Content type
   * @param contentId Content ID
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated comments list
   */
  @Get()
  async getComments(
    @Query('contentType') contentType: 'movie' | 'comic',
    @Query('contentId') contentId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.commentsService.getComments(contentType, contentId, parseInt(page), parseInt(limit));
  }

  /**
   * Get replies for a comment
   * @param parentId Parent comment ID
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated replies list
   */
  @Get('replies/:parentId')
  async getReplies(
    @Param('parentId') parentId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.commentsService.getReplies(parentId, parseInt(page), parseInt(limit));
  }

  /**
   * Update a comment
   * @param user Current authenticated user
   * @param commentId Comment ID
   * @param updateDto Update data
   * @returns Updated comment
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: any,
    @Param('id') commentId: string,
    @Body() updateDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(commentId, user.userId, updateDto);
  }

  /**
   * Delete a comment
   * @param user Current authenticated user
   * @param commentId Comment ID
   * @returns Success status
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser() user: any,
    @Param('id') commentId: string,
  ) {
    await this.commentsService.delete(commentId, user.userId);
    return { message: 'Comment deleted successfully' };
  }

  /**
   * Like or unlike a comment
   * @param commentId Comment ID
   * @param like Whether to like (true) or unlike (false)
   * @returns Updated comment
   */
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async toggleLike(
    @Param('id') commentId: string,
    @Body('like') like: boolean = true,
  ) {
    return this.commentsService.toggleLike(commentId, like);
  }
}
