import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Rating document type
 */
export type RatingDocument = Rating & Document;

/**
 * Rating schema definition
 * Stores user star ratings for movies and comics
 */
@Schema({
  timestamps: true,
  collection: 'ratings',
})
export class Rating {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  contentType: 'movie' | 'comic';

  @Prop({ required: true, index: true })
  contentId: string;

  @Prop({ required: true, min: 1, max: 5 })
  stars: number; // Rating from 1 to 5 stars

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

// Compound unique index to prevent duplicate ratings
RatingSchema.index({ userId: 1, contentType: 1, contentId: 1 }, { unique: true });
// Index for efficient queries
RatingSchema.index({ contentType: 1, contentId: 1 });
