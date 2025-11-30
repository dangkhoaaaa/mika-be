import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Favorite document type
 */
export type FavoriteDocument = Favorite & Document;

/**
 * Favorite schema definition
 * Stores user's favorite comics
 */
@Schema({
  timestamps: true,
  collection: 'favorites',
})
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  contentType: 'comic' | 'movie'; // Supports both comics and movies

  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true })
  contentTitle: string;

  @Prop({ default: '' })
  contentThumb: string;

  @Prop({ default: '' })
  contentSlug: string;

  @Prop({ default: Date.now })
  addedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// Compound unique index to prevent duplicates
FavoriteSchema.index({ userId: 1, contentType: 1, contentId: 1 }, { unique: true });
// Index for efficient queries
FavoriteSchema.index({ userId: 1, addedAt: -1 });
