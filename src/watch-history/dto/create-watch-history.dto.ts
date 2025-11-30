import { IsNotEmpty, IsString, IsIn, IsOptional, IsNumber, Min } from 'class-validator';

/**
 * DTO for creating watch history entry
 */
export class CreateWatchHistoryDto {
  @IsNotEmpty({ message: 'Content type is required' })
  @IsIn(['movie', 'comic'], { message: 'Content type must be either movie or comic' })
  contentType: 'movie' | 'comic';

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
  episodeId?: string;

  @IsOptional()
  @IsString()
  episodeName?: string;

  @IsOptional()
  @IsString()
  chapterId?: string;

  @IsOptional()
  @IsString()
  chapterName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  watchTime?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDuration?: number;
}
