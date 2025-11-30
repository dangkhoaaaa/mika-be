import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating, RatingDocument } from './schemas/rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

/**
 * Ratings service
 * Handles star ratings for movies and comics
 */
@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  /**
   * Create or update a rating
   * @param userId User ID
   * @param createDto Rating data
   * @returns Created or updated rating
   */
  async createOrUpdate(userId: string, createDto: CreateRatingDto): Promise<RatingDocument> {
    const existingRating = await this.ratingModel.findOne({
      userId: new Types.ObjectId(userId),
      contentType: createDto.contentType,
      contentId: createDto.contentId,
    });

    if (existingRating) {
      // Update existing rating
      existingRating.stars = createDto.stars;
      existingRating.updatedAt = new Date();
      return existingRating.save();
    }

    // Create new rating
    const rating = new this.ratingModel({
      userId: new Types.ObjectId(userId),
      ...createDto,
    });

    return rating.save();
  }

  /**
   * Get user's rating for a content item
   * @param userId User ID
   * @param contentType Content type
   * @param contentId Content ID
   * @returns User's rating or null
   */
  async getUserRating(
    userId: string,
    contentType: 'movie' | 'comic',
    contentId: string,
  ): Promise<RatingDocument | null> {
    return this.ratingModel
      .findOne({
        userId: new Types.ObjectId(userId),
        contentType,
        contentId,
      })
      .exec();
  }

  /**
   * Get average rating and total count for content
   * @param contentType Content type
   * @param contentId Content ID
   * @returns Rating statistics
   */
  async getContentRating(
    contentType: 'movie' | 'comic',
    contentId: string,
  ): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const ratings = await this.ratingModel
      .find({
        contentType,
        contentId,
      })
      .exec();

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    const averageRating = totalStars / ratings.length;

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating) => {
      distribution[rating.stars as keyof typeof distribution]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: ratings.length,
      ratingDistribution: distribution,
    };
  }

  /**
   * Delete a rating
   * @param userId User ID
   * @param contentType Content type
   * @param contentId Content ID
   * @returns Success status
   */
  async deleteRating(
    userId: string,
    contentType: 'movie' | 'comic',
    contentId: string,
  ): Promise<boolean> {
    const result = await this.ratingModel.deleteOne({
      userId: new Types.ObjectId(userId),
      contentType,
      contentId,
    }).exec();

    return result.deletedCount > 0;
  }
}
