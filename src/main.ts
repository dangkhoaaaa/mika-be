import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

/**
 * Bootstrap the NestJS application
 * Sets up global validation pipes, CORS configuration, and static file serving
 */
export async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend applications
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  });

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  return app;
}

// In a development environment, you might still want to run it directly
// if (process.env.NODE_ENV !== 'production') {
//   createApp().then(app => {
//     const port = process.env.PORT || 3000;
//     app.listen(port);
//     console.log(`🚀 Application is running on: http://localhost:${port}/api`);
//   });
// }
// For serverless deployment, the platform will call createApp()
// and then app.listen() or integrate it with their http adapter.

