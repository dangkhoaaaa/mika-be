import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WatchLater, WatchLaterDocument } from './schemas/watch-later.schema';
import { CreateWatchLaterDto } from './dto/create-watch-later.dto';

/**
 * WatchLater service
 * Handles user's watch later list management
 */
@Injectable()
export class WatchLaterService {
  constructor(
    @InjectModel(WatchLater.name) private watchLaterModel: Model<WatchLaterDocument>,
  ) {}

  /**
   * Add a content to watch later
   * @param userId User ID
   * @param createDto Watch later data
   * @returns Created watch later entry
   */
  async addWatchLater(userId: string, createDto: CreateWatchLaterDto): Promise<WatchLaterDocument> {
    // Check if already in watch later
    const existing = await this.watchLaterModel.findOne({
      userId: new Types.ObjectId(userId),
      contentType: createDto.contentType,
      contentId: createDto.contentId,
    });

    if (existing) {
      throw new ConflictException('This content is already in your watch later list');
    }

    // Create new watch later entry
    const watchLater = new this.watchLaterModel({
      userId: new Types.ObjectId(userId),
      ...createDto,
      addedAt: new Date(),
    });

    return watchLater.save();
  }

  /**
   * Remove a content from watch later
   * @param userId User ID
   * @param contentId Content ID
   * @returns Success status
   */
  async removeWatchLater(userId: string, contentId: string): Promise<boolean> {
    const result = await this.watchLaterModel.deleteOne({
      userId: new Types.ObjectId(userId),
      contentId,
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Watch later entry not found');
    }

    return true;
  }

  /**
   * Get user's watch later list
   * @param userId User ID
   * @param contentType Optional filter by content type
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated watch later list
   */
  async getUserWatchLater(
    userId: string,
    contentType?: 'movie' | 'comic',
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    items: WatchLaterDocument[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (contentType) {
      query.contentType = contentType;
    }

    const skip = (page - 1) * limit;
    const [items, totalItems] = await Promise.all([
      this.watchLaterModel
        .find(query)
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.watchLaterModel.countDocuments(query).exec(),
    ]);

    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  /**
   * Check if a content is in user's watch later list
   * @param userId User ID
   * @param contentId Content ID
   * @returns Boolean indicating if content is in watch later
   */
  async isInWatchLater(userId: string, contentId: string): Promise<boolean> {
    const watchLater = await this.watchLaterModel.findOne({
      userId: new Types.ObjectId(userId),
      contentId,
    }).exec();

    return !!watchLater;
  }

  /**
   * Clear all watch later for a user
   * @param userId User ID
   * @returns Number of deleted watch later entries
   */
  async clearWatchLater(userId: string): Promise<number> {
    const result = await this.watchLaterModel.deleteMany({
      userId: new Types.ObjectId(userId),
    }).exec();

    return result.deletedCount;
  }
}

