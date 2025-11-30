import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

/**
 * DTO for updating watch history entry
 */
export class UpdateWatchHistoryDto {
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
