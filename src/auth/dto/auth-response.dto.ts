import { Expose } from 'class-transformer';

/**
 * DTO for authentication response
 * Contains access token and user information
 */
export class AuthResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  user: {
    _id: string;
    email: string;
    username: string;
    fullName: string;
    avatar: string;
  };
}
