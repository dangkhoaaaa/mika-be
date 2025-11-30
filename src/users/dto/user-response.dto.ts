import { Exclude, Expose } from 'class-transformer';

/**
 * DTO for user response
 * Excludes sensitive information like password from API responses
 */
export class UserResponseDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  fullName: string;

  @Expose()
  avatar: string;

  @Expose()
  bio: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  __v: number;
}
