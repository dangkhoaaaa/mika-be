import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Root application controller
 * Provides health check and basic API information
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }

  /**
   * API động để kích hoạt render khi người dùng vào web
   * Không yêu cầu authentication, chỉ để wake up server
   */
  @Get('ping')
  ping(): { status: string; message: string; timestamp: string } {
    return {
      status: 'ok',
      message: 'Server is awake',
      timestamp: new Date().toISOString(),
    };
  }
}
