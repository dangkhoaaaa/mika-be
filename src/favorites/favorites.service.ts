import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite, FavoriteDocument } from './schemas/favorite.schema';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

/**
 * Favorites service
 * Handles user's favorite comics management
 */
@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  /**
   * Add a comic to favorites
   * @param userId User ID
   * @param createDto Favorite data
   * @returns Created favorite entry
   */
  async addFavorite(userId: string, createDto: CreateFavoriteDto): Promise<FavoriteDocument> {
    // Check if already in favorites
    const existing = await this.favoriteModel.findOne({
      userId: new Types.ObjectId(userId),
      contentType: createDto.contentType,
      contentId: createDto.contentId,
    });

    if (existing) {
      throw new ConflictException('This comic is already in your favorites');
    }

    // Create new favorite entry
    const favorite = new this.favoriteModel({
      userId: new Types.ObjectId(userId),
      ...createDto,
      addedAt: new Date(),
    });

    return favorite.save();
  }

  /**
   * Remove a comic from favorites
   * @param userId User ID
   * @param contentId Content ID
   * @returns Success status
   */
  async removeFavorite(userId: string, contentId: string): Promise<boolean> {
    const result = await this.favoriteModel.deleteOne({
      userId: new Types.ObjectId(userId),
      contentId,
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Favorite not found');
    }

    return true;
  }

  /**
   * Get user's favorites
   * @param userId User ID
   * @param contentType Optional filter by content type
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated favorites list
   */
  async getUserFavorites(
    userId: string,
    contentType?: 'movie' | 'comic',
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    items: FavoriteDocument[];
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
      this.favoriteModel
        .find(query)
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.favoriteModel.countDocuments(query).exec(),
    ]);

    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  /**
   * Check if a comic is in user's favorites
   * @param userId User ID
   * @param contentId Content ID
   * @returns Boolean indicating if comic is favorited
   */
  async isFavorite(userId: string, contentId: string): Promise<boolean> {
    const favorite = await this.favoriteModel.findOne({
      userId: new Types.ObjectId(userId),
      contentId,
    }).exec();

    return !!favorite;
  }

  /**
   * Clear all favorites for a user
   * @param userId User ID
   * @returns Number of deleted favorites
   */
  async clearFavorites(userId: string): Promise<number> {
    const result = await this.favoriteModel.deleteMany({
      userId: new Types.ObjectId(userId),
    }).exec();

    return result.deletedCount;
  }
}
