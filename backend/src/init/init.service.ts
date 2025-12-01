import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    console.log('🔧 Initialisation de l\'application...');
    await this.ensureAdminExists();
  }

  async ensureAdminExists() {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@voiture.com';
      
      // Vérifier si l'admin existe déjà
      const existingAdmin = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (existingAdmin) {
        // Mettre à jour l'admin existant avec le nouveau mot de passe
        const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
        const passwordHash = await bcrypt.hash(password, 10);
        
        await this.prisma.user.update({
          where: { email: adminEmail },
          data: {
            passwordHash,
            role: UserRole.SUPER_ADMIN,
            isActive: true,
            isEmailVerified: true,
          },
        });
        console.log('✅ Admin existant mis à jour');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Nouveau mot de passe: ${password}`);

        // Vérifier et créer le wallet si nécessaire
        const wallet = await this.prisma.wallet.findUnique({
          where: { userId: existingAdmin.id },
        });

        if (!wallet) {
          await this.prisma.wallet.create({
            data: {
              userId: existingAdmin.id,
              balanceCredits: BigInt(100000),
            },
          });
          console.log('✅ Wallet créé pour l\'admin (100 000 crédits)');
        }

        return;
      }

      // Créer l'admin s'il n'existe pas
      console.log('👤 Création de l\'administrateur principal...');
      
      const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
      const passwordHash = await bcrypt.hash(password, 10);

      const admin = await this.prisma.user.create({
        data: {
          email: adminEmail,
          name: process.env.ADMIN_NAME || 'Administrateur',
          phone: process.env.ADMIN_PHONE || '+225XXXXXXXXXX',
          passwordHash,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
          isEmailVerified: true,
        },
      });

      // Créer le wallet avec 100 000 crédits
      await this.prisma.wallet.create({
        data: {
          userId: admin.id,
          balanceCredits: BigInt(100000),
        },
      });

      console.log('✅ Administrateur principal créé avec succès !');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Mot de passe: ${password}`);
      console.log(`   Wallet: 100 000 crédits`);
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'admin:', error);
      // Ne pas bloquer le démarrage de l'application
    }
  }
}

