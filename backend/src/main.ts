import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',') 
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Préfixe API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || process.env.BACKEND_PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend démarré sur http://localhost:${port}/api`);
}

bootstrap();





