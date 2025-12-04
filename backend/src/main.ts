import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  // ✅ Nettoyer FRONTEND_URL (enlever virgules si multiples URLs)
  const cleanFrontendUrl = frontendUrl.split(',')[0].trim();
  
  const allowedOrigins = [
    cleanFrontendUrl,
    'http://localhost:3000',
    'https://annonceauto.ci',
    'https://www.annonceauto.ci',
    'https://voiture-annonces-production.up.railway.app', // Temporaire pour debug
  ].filter((value, index, self) => value && self.indexOf(value) === index); // Remove duplicates and empty values
  
  console.log('🔒 CORS Origins autorisés:', allowedOrigins);
  
  app.enableCors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: Postman, curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn('⚠️  CORS bloqué pour:', origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
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
  console.log(`📌 Frontend URL: ${cleanFrontendUrl}`);
  console.log(`📌 Backend URL: ${process.env.BACKEND_URL || 'non défini'}`);
}

bootstrap();





