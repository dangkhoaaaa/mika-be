import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { plainToClass } from 'class-transformer';

/**
 * Users controller
 * Handles HTTP requests related to user profile management
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current user profile
   * @param user Current authenticated user
   * @returns User profile data
   */
  @Get('profile')
  async getProfile(@CurrentUser() user: any): Promise<UserResponseDto> {
    const userData = await this.usersService.findById(user.userId);
    return plainToClass(UserResponseDto, userData, { excludeExtraneousValues: true });
  }

  /**
   * Update user profile
   * @param user Current authenticated user
   * @param updateUserDto Profile update data
   * @returns Updated user profile
   */
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateProfile(user.userId, updateUserDto);
    return plainToClass(UserResponseDto, updatedUser, { excludeExtraneousValues: true });
  }

  // TODO: Re-enable avatar upload functionality when a writable file system is available.
  // /**
  //  * Upload user avatar
  //  * @param user Current authenticated user
  //  * @param file Avatar image file
  //  * @returns Updated user with new avatar path
  //  */
  // @Put('avatar')
  // @UseInterceptors(
  //   FileInterceptor('avatar', {
  //     storage: diskStorage({
  //       destination: '/tmp/uploads/avatars',
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         cb(null, `${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //     limits: {
  //       fileSize: 5 * 1024 * 1024, // 5MB
  //     },
  //   }),
  // )
  // async uploadAvatar(
  //   @CurrentUser() user: any,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
  //         new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)/ }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ): Promise<UserResponseDto> {
  //   const avatarPath = `/uploads/avatars/${file.filename}`;
  //   const updatedUser = await this.usersService.updateAvatar(user.userId, avatarPath);
  //   return plainToClass(UserResponseDto, updatedUser, { excludeExtraneousValues: true });
  // }

}
