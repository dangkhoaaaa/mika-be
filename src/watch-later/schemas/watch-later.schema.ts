import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * WatchLater document type
 */
export type WatchLaterDocument = WatchLater & Document;

/**
 * WatchLater schema definition
 * Stores user's watch later list (similar to favorites)
 */
@Schema({
  timestamps: true,
  collection: 'watch_later',
})
export class WatchLater {
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

export const WatchLaterSchema = SchemaFactory.createForClass(WatchLater);

// Compound unique index to prevent duplicates
WatchLaterSchema.index({ userId: 1, contentType: 1, contentId: 1 }, { unique: true });
// Index for efficient queries
WatchLaterSchema.index({ userId: 1, addedAt: -1 });

