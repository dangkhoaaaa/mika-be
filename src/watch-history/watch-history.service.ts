import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WatchHistory, WatchHistoryDocument } from './schemas/watch-history.schema';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';

/**
 * Watch history service
 * Handles user viewing history for movies and comics
 */
@Injectable()
export class WatchHistoryService {
  constructor(
    @InjectModel(WatchHistory.name) private watchHistoryModel: Model<WatchHistoryDocument>,
  ) {}

  /**
   * Create or update watch history entry
   * @param userId User ID
   * @param createDto Watch history data
   * @returns Created or updated watch history entry
   */
  async createOrUpdate(userId: string, createDto: CreateWatchHistoryDto): Promise<WatchHistoryDocument> {
    const existingHistory = await this.watchHistoryModel.findOne({
      userId: new Types.ObjectId(userId),
      contentId: createDto.contentId,
    });

    if (existingHistory) {
      // Update existing entry
      existingHistory.lastWatchedAt = new Date();
      if (createDto.episodeId) existingHistory.episodeId = createDto.episodeId;
      if (createDto.episodeName) existingHistory.episodeName = createDto.episodeName;
      if (createDto.chapterId) existingHistory.chapterId = createDto.chapterId;
      if (createDto.chapterName) existingHistory.chapterName = createDto.chapterName;
      if (createDto.watchTime !== undefined) existingHistory.watchTime = createDto.watchTime;
      if (createDto.totalDuration !== undefined) existingHistory.totalDuration = createDto.totalDuration;
      if (createDto.contentThumb) existingHistory.contentThumb = createDto.contentThumb;
      
      return existingHistory.save();
    }

    // Create new entry
    const newHistory = new this.watchHistoryModel({
      userId: new Types.ObjectId(userId),
      ...createDto,
      lastWatchedAt: new Date(),
    });

    return newHistory.save();
  }

  /**
   * Get watch history for a user
   * @param userId User ID
   * @param contentType Optional filter by content type
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated watch history list
   */
  async getUserWatchHistory(
    userId: string,
    contentType?: 'movie' | 'comic',
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    items: WatchHistoryDocument[];
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
      this.watchHistoryModel
        .find(query)
        .sort({ lastWatchedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.watchHistoryModel.countDocuments(query).exec(),
    ]);

    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  /**
   * Get specific watch history entry
   * @param userId User ID
   * @param contentId Content ID
   * @returns Watch history entry or null
   */
  async getWatchHistory(userId: string, contentId: string): Promise<WatchHistoryDocument | null> {
    return this.watchHistoryModel
      .findOne({
        userId: new Types.ObjectId(userId),
        contentId,
      })
      .exec();
  }

  /**
   * Update watch history entry
   * @param userId User ID
   * @param contentId Content ID
   * @param updateDto Update data
   * @returns Updated watch history entry
   */
  async updateWatchHistory(
    userId: string,
    contentId: string,
    updateDto: UpdateWatchHistoryDto,
  ): Promise<WatchHistoryDocument> {
    const updated = await this.watchHistoryModel
      .findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          contentId,
        },
        {
          ...updateDto,
          lastWatchedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Watch history not found');
    }

    return updated;
  }

  /**
   * Delete watch history entry
   * @param userId User ID
   * @param contentId Content ID
   * @returns Success status
   */
  async deleteWatchHistory(userId: string, contentId: string): Promise<boolean> {
    const result = await this.watchHistoryModel
      .deleteOne({
        userId: new Types.ObjectId(userId),
        contentId,
      })
      .exec();

    return result.deletedCount > 0;
  }

  /**
   * Clear all watch history for a user
   * @param userId User ID
   * @param contentType Optional filter by content type
   * @returns Number of deleted entries
   */
  async clearWatchHistory(userId: string, contentType?: 'movie' | 'comic'): Promise<number> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (contentType) {
      query.contentType = contentType;
    }

    const result = await this.watchHistoryModel.deleteMany(query).exec();
    return result.deletedCount;
  }
}
