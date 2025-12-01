import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
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

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
bootstrap();