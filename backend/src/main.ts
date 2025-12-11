import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 [STARTUP] Début du bootstrap...');
  console.log('🔍 [STARTUP] Variables d\'env:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Présent' : '❌ Manquant',
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Présent' : '❌ Manquant',
  });
  
  const app = await NestFactory.create(AppModule);
  console.log('✅ [STARTUP] AppModule créé');

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
  
  console.log('🔒 [CORS] Origins autorisés:', allowedOrigins);
  console.log('🔒 [CORS] FRONTEND_URL brute:', process.env.FRONTEND_URL);
  
  app.enableCors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: Postman, curl)
      if (!origin) {
        console.log('✅ [CORS] Requête sans origin autorisée');
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log('✅ [CORS] Autorisé:', origin);
        callback(null, true);
      } else {
        console.warn('⚠️  [CORS] BLOQUÉ pour:', origin);
        console.warn('⚠️  [CORS] Origins valides:', allowedOrigins);
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

bootstrap().catch((error) => {
  console.error('💥 [FATAL] Erreur au démarrage:', error);
  console.error('💥 [FATAL] Stack:', error.stack);
  process.exit(1);
});





