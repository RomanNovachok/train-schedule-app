import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

function normalizeOrigin(origin: string) {
  return origin.replace(/\/+$/, '');
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;

  const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL,
    process.env.RENDER_EXTERNAL_URL,
    'https://train-schedule-app-7yzy.onrender.com',
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map(normalizeOrigin);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation: origin not allowed'), false);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swaggerServerUrl = normalizeOrigin(
    process.env.RENDER_EXTERNAL_URL ||
      process.env.BACKEND_URL ||
      `http://localhost:${port}`,
  );
  const swaggerServerLabel = swaggerServerUrl.includes('onrender.com')
    ? 'Render production'
    : 'Local development';

  const config = new DocumentBuilder()
    .setTitle('Train Schedule API')
    .setDescription('API for train schedule management with JWT authentication')
    .setVersion('1.0')
    .addServer(swaggerServerUrl, swaggerServerLabel)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  logger.log(`Backend running on port ${port}`);
  logger.log(`Swagger UI available at http://localhost:${port}/api`);
  logger.log(`Swagger server target: ${swaggerServerUrl}`);
}

bootstrap();
