import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchLaterController } from './watch-later.controller';
import { WatchLaterService } from './watch-later.service';
import { WatchLater, WatchLaterSchema } from './schemas/watch-later.schema';

/**
 * WatchLater module
 * Provides functionality to manage user's watch later list
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: WatchLater.name, schema: WatchLaterSchema }]),
  ],
  controllers: [WatchLaterController],
  providers: [WatchLaterService],
  exports: [WatchLaterService],
})
export class WatchLaterModule {}

