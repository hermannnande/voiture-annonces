import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { MessagesModule } from './messages/messages.module';
import { BoostsModule } from './boosts/boosts.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';
import { AuditModule } from './audit/audit.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Note: ServeStaticModule retiré car on utilise ImageKit pour le stockage cloud

    // Rate limiting (protection contre le spam)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requêtes max
      },
    ]),

    // Tâches planifiées
    ScheduleModule.forRoot(),

    // Modules de l'application
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    BrandsModule,
    CategoriesModule,
    MessagesModule,
    BoostsModule,
    AdminModule,
    UploadsModule,
    AuditModule,
    WalletModule,
  ],
})
export class AppModule {}

