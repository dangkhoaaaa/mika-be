import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

/**
 * Comments service
 * Handles comment operations for movies and comics
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  /**
   * Create a new comment
   * @param userId User ID
   * @param createDto Comment data
   * @returns Created comment with user population
   */
  async create(userId: string, createDto: CreateCommentDto): Promise<CommentDocument> {
    const comment = new this.commentModel({
      userId: new Types.ObjectId(userId),
      ...createDto,
      parentId: createDto.parentId ? new Types.ObjectId(createDto.parentId) : null,
    });

    const savedComment = await comment.save();
    return this.commentModel.findById(savedComment._id).populate('userId', 'username avatar fullName').exec();
  }

  /**
   * Get comments for a content item
   * @param contentType Content type (movie/comic)
   * @param contentId Content ID
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated comments list
   */
  async getComments(
    contentType: 'movie' | 'comic',
    contentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    items: CommentDocument[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    const query = {
      contentType,
      contentId,
      parentId: null, // Only top-level comments
      isActive: true,
    };

    const [items, totalItems] = await Promise.all([
      this.commentModel
        .find(query)
        .populate('userId', 'username avatar fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments(query).exec(),
    ]);

    // Get replies for each comment
    const itemsWithReplies = await Promise.all(
      items.map(async (comment) => {
        const replies = await this.commentModel
          .find({ parentId: comment._id, isActive: true })
          .populate('userId', 'username avatar fullName')
          .sort({ createdAt: 1 })
          .limit(5)
          .exec();
        
        const commentObj = comment.toObject();
        return { ...commentObj, replies };
      }),
    );

    return {
      items: itemsWithReplies as any,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  /**
   * Get replies for a comment
   * @param parentId Parent comment ID
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated replies list
   */
  async getReplies(
    parentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    items: CommentDocument[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    const query = {
      parentId: new Types.ObjectId(parentId),
      isActive: true,
    };

    const [items, totalItems] = await Promise.all([
      this.commentModel
        .find(query)
        .populate('userId', 'username avatar fullName')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments(query).exec(),
    ]);

    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  /**
   * Update a comment
   * @param commentId Comment ID
   * @param userId User ID (to verify ownership)
   * @param updateDto Update data
   * @returns Updated comment
   */
  async update(commentId: string, userId: string, updateDto: UpdateCommentDto): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this comment');
    }

    comment.content = updateDto.content;
    comment.isEdited = true;
    comment.updatedAt = new Date();

    const updated = await comment.save();
    return this.commentModel.findById(updated._id).populate('userId', 'username avatar fullName').exec();
  }

  /**
   * Delete a comment (soft delete)
   * @param commentId Comment ID
   * @param userId User ID (to verify ownership)
   * @returns Success status
   */
  async delete(commentId: string, userId: string): Promise<boolean> {
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment');
    }

    // Soft delete - set isActive to false
    comment.isActive = false;
    await comment.save();

    return true;
  }

  /**
   * Like or unlike a comment
   * @param commentId Comment ID
   * @param like Whether to like (true) or unlike (false)
   * @returns Updated comment
   */
  async toggleLike(commentId: string, like: boolean): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (like) {
      comment.likes += 1;
    } else {
      comment.likes = Math.max(0, comment.likes - 1);
    }

    return comment.save();
  }
}
