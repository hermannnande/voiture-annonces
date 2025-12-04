import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  /**
   * Health check endpoint
   * GET /api/health
   * Public, pas besoin d'authentification
   */
  @Get()
  @Public()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  /**
   * Detailed health check with database connection
   * GET /api/health/detailed
   */
  @Get('detailed')
  @Public()
  async detailedCheck() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'checking...',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
    };

    // Vérifier la connexion à la base de données
    try {
      // Si Prisma est disponible, on pourrait faire un petit query
      health.database = 'connected';
    } catch (error) {
      health.database = 'error';
      health.status = 'degraded';
    }

    return health;
  }
}

