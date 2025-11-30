import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

/**
 * DTO for creating favorite entry
 */
export class CreateFavoriteDto {
  @IsNotEmpty({ message: 'Content type is required' })
  @IsIn(['comic', 'movie'], { message: 'Content type must be comic or movie' })
  contentType: 'comic' | 'movie';

  @IsNotEmpty({ message: 'Content ID is required' })
  @IsString()
  contentId: string;

  @IsNotEmpty({ message: 'Content title is required' })
  @IsString()
  contentTitle: string;

  @IsOptional()
  @IsString()
  contentThumb?: string;

  @IsOptional()
  @IsString()
  contentSlug?: string;
}
