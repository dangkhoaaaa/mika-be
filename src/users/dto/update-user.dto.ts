import { IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';

/**
 * DTO for updating user profile
 * All fields are optional for partial updates
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
