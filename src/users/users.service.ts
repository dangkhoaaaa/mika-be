import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Users service
 * Handles user-related business logic including CRUD operations
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Create a new user account
   * @param createUserDto User registration data
   * @returns Created user (without password)
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<UserDocument, 'password'>> {
    // Check if user with email already exists
    const existingUserByEmail = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if user with username already exists
    const existingUserByUsername = await this.userModel.findOne({ username: createUserDto.username });
    if (existingUserByUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();
    
    // Remove password from response
    const userObj = savedUser.toObject();
    delete userObj.password;
    return userObj;
  }

  /**
   * Find user by email
   * @param email User email
   * @returns User document with password (for authentication)
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Find user by ID
   * @param id User ID
   * @returns User document (without password)
   */
  async findById(id: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id).select('-password').exec();
    return user;
  }

  /**
   * Find user by username
   * @param username Username
   * @returns User document (without password)
   */
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).select('-password').exec();
  }

  /**
   * Update user profile
   * @param userId User ID
   * @param updateUserDto Update data
   * @returns Updated user (without password)
   */
  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  /**
   * Update user avatar
   * @param userId User ID
   * @param avatarPath Path to avatar file
   * @returns Updated user (without password)
   */
  async updateAvatar(userId: string, avatarPath: string): Promise<UserDocument | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }
}
