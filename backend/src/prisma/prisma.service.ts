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

      // ✅ Middleware pour logger les requêtes lentes
      this.$use(async (params, next) => {
        const start = Date.now();
        const result = await next(params);
        const duration = Date.now() - start;

        // Logger si requête > 1 seconde
        if (duration > 1000) {
          this.logger.warn(
            `⚠️  Requête lente: ${params.model}.${params.action} - ${duration}ms`
          );
        }

        return result;
      });

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
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}





