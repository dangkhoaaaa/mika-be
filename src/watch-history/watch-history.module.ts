import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchHistoryController } from './watch-history.controller';
import { WatchHistoryService } from './watch-history.service';
import { WatchHistory, WatchHistorySchema } from './schemas/watch-history.schema';

/**
 * Watch history module
 * Provides functionality to track and manage user viewing history
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: WatchHistory.name, schema: WatchHistorySchema }]),
  ],
  controllers: [WatchHistoryController],
  providers: [WatchHistoryService],
  exports: [WatchHistoryService],
})
export class WatchHistoryModule {}
