import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Comment document type
 */
export type CommentDocument = Comment & Document;

/**
 * Comment schema definition
 * Stores user comments on movies and comics
 */
@Schema({
  timestamps: true,
  collection: 'comments',
})
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  contentType: 'movie' | 'comic';

  @Prop({ required: true, index: true })
  contentId: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentId: Types.ObjectId | null; // For nested/reply comments

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Indexes for efficient queries
CommentSchema.index({ contentType: 1, contentId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });
