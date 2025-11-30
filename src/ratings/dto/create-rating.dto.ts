import { IsNotEmpty, IsNumber, IsIn, Min, Max } from 'class-validator';

/**
 * DTO for creating a rating
 */
export class CreateRatingDto {
  @IsNotEmpty({ message: 'Content type is required' })
  @IsIn(['movie', 'comic'], { message: 'Content type must be either movie or comic' })
  contentType: 'movie' | 'comic';

  @IsNotEmpty({ message: 'Content ID is required' })
  contentId: string;

  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  stars: number;
}
