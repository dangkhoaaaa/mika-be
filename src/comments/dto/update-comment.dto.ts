import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for updating a comment
 */
export class UpdateCommentDto {
  @IsNotEmpty({ message: 'Comment content is required' })
  @IsString()
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  content: string;
}
