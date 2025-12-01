import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'https://annonceauto.ci',
    'https://www.annonceauto.ci',
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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





