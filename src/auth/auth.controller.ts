import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { plainToClass } from 'class-transformer';

/**
 * Authentication controller
 * Handles user registration and login endpoints
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user account
   * @param createUserDto User registration data
   * @returns Authentication response with token
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const result = await this.authService.register(createUserDto);
    return plainToClass(AuthResponseDto, result, { excludeExtraneousValues: true });
  }

  /**
   * Login user and get access token
   * @param loginDto Login credentials
   * @returns Authentication response with token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    return plainToClass(AuthResponseDto, result, { excludeExtraneousValues: true });
  }
}
