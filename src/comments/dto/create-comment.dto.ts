import { IsNotEmpty, IsString, IsIn, IsOptional, MaxLength, IsMongoId } from 'class-validator';

/**
 * DTO for creating a comment
 */
export class CreateCommentDto {
  @IsNotEmpty({ message: 'Content type is required' })
  @IsIn(['movie', 'comic'], { message: 'Content type must be either movie or comic' })
  contentType: 'movie' | 'comic';

  @IsNotEmpty({ message: 'Content ID is required' })
  @IsString()
  contentId: string;

  @IsNotEmpty({ message: 'Comment content is required' })
  @IsString()
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  content: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string; // For reply comments
}
