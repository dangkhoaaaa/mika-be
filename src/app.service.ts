import { Injectable } from '@nestjs/common';

/**
 * Root application service
 * Provides basic application information and health checks
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to beMika API - Backend for phimMika and truyenMika';
  }

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
