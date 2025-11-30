import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Watch history document type
 */
export type WatchHistoryDocument = WatchHistory & Document;

/**
 * Watch history schema definition
 * Tracks user viewing history for movies and comics
 */
@Schema({
  timestamps: true,
  collection: 'watch_history',
})
export class WatchHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  contentType: 'movie' | 'comic';

  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true })
  contentTitle: string;

  @Prop({ default: '' })
  contentSlug: string;

  @Prop({ default: '' })
  contentThumb: string;

  @Prop({ default: '' })
  episodeId: string;

  @Prop({ default: '' })
  episodeName: string;

  @Prop({ default: '' })
  chapterId: string;

  @Prop({ default: '' })
  chapterName: string;

  @Prop({ default: 0 })
  watchTime: number; // Time watched in seconds

  @Prop({ default: 0 })
  totalDuration: number; // Total duration in seconds

  @Prop({ default: Date.now })
  lastWatchedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const WatchHistorySchema = SchemaFactory.createForClass(WatchHistory);

// Compound index for efficient queries
WatchHistorySchema.index({ userId: 1, contentType: 1, lastWatchedAt: -1 });
WatchHistorySchema.index({ userId: 1, contentId: 1 }, { unique: true });
