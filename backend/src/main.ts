import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.PORT || 3333;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}

bootstrap();
