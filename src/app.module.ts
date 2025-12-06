import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WatchHistoryModule } from './watch-history/watch-history.module';
import { FavoritesModule } from './favorites/favorites.module';
import { WatchLaterModule } from './watch-later/watch-later.module';
import { CommentsModule } from './comments/comments.module';
import { RatingsModule } from './ratings/ratings.module';

/**
 * Root application module
 * Configures global modules, database connection, and feature modules
 */
@Module({
  imports: [
    // Configuration module with environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/bemika'),
    // Feature modules
    AuthModule,
    UsersModule,
    WatchHistoryModule,
    FavoritesModule,
    WatchLaterModule,
    CommentsModule,
    RatingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
