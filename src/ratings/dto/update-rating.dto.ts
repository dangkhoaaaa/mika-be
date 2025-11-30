import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

/**
 * DTO for updating a rating
 */
export class UpdateRatingDto {
  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  stars: number;
}
