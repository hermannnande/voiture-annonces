import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error', 'warn'],
      errorFormat: 'minimal',
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      // ✅ Connexion avec retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          await this.$connect();
          this.logger.log('✅ Connexion à la base de données réussie');
          break;
        } catch (error) {
          retries--;
          this.logger.warn(`Tentative de connexion échouée. Restant: ${retries}`);
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2s
        }
      }

    } catch (error) {
      this.logger.error('❌ Erreur de connexion à la base de données:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✅ Déconnexion de la base de données');
    } catch (error) {
      this.logger.error('❌ Erreur lors de la déconnexion:', error);
    }
  }

  // ✅ Helper pour nettoyer les connexions
  async enableShutdownHooks(app: any) {
    // Prisma v6+ gère automatiquement le cleanup
    // Pas besoin de hook manuel
    this.logger.log('Shutdown hooks configurés (gérés automatiquement par Prisma)');
  }
}





