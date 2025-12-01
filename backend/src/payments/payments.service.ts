import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { AuditService } from '../audit/audit.service';
import { InitializePaymentDto } from './dto';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly monerooApiUrl = 'https://api.moneroo.io/v1';
  private readonly monerooApiKey: string;

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private auditService: AuditService,
  ) {
    this.monerooApiKey = process.env.MONEROO_API_KEY || '';

    if (!this.monerooApiKey) {
      console.warn('⚠️  Clé Moneroo non configurée. Le système de paiement automatique sera désactivé.');
    } else {
      console.log('✅ Moneroo configuré avec succès - Paiement automatique activé 🚀');
      console.log('📌 API Key:', this.monerooApiKey.substring(0, 15) + '...');
    }
  }

  /**
   * Calculer le prix en FCFA en fonction du nombre de crédits
   */
  calculatePrice(creditsAmount: number): number {
    // Packs de crédits avec tarifs dégressifs
    if (creditsAmount >= 500) {
      return creditsAmount * 90; // 90 FCFA/crédit (pack Premium, -10%)
    } else if (creditsAmount >= 100) {
      return creditsAmount * 95; // 95 FCFA/crédit (pack Standard, -5%)
    } else {
      return creditsAmount * 100; // 100 FCFA/crédit (pack Starter)
    }
  }

  /**
   * Initialiser un paiement FedaPay pour acheter des crédits
   */
  async initializePayment(userId: string, dto: InitializePaymentDto) {
    if (!this.monerooApiKey) {
      throw new BadRequestException('Le système de paiement automatique n\'est pas configuré');
    }

    // Récupérer l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    // Calculer le montant en FCFA
    const amountFcfa = this.calculatePrice(dto.creditsAmount);

    // URL de retour par défaut
    const returnUrl = dto.returnUrl || `${process.env.FRONTEND_URL}/dashboard/wallet/payment-result`;

    // Extraire le prénom et nom
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || user.name;
    const lastName = nameParts.slice(1).join(' ') || 'Client';

    // Préparer les données pour Moneroo
    const paymentData = {
      amount: amountFcfa,
      currency: 'XOF', // Franc CFA
      description: `Achat de ${dto.creditsAmount} crédits - ${dto.packName || 'Pack personnalisé'}`,
      return_url: returnUrl,
      customer: {
        email: user.email,
        first_name: firstName,
        last_name: lastName,
      },
      metadata: {
        user_id: userId,
        credits_amount: dto.creditsAmount.toString(),
        pack_name: dto.packName || 'custom',
      },
    };

    try {
      console.log('🔄 Initialisation paiement Moneroo...', { amount: amountFcfa, credits: dto.creditsAmount });

      // Appeler l'API Moneroo pour initialiser le paiement
      const response = await axios.post(
        `${this.monerooApiUrl}/payments/initialize`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${this.monerooApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        },
      );

      const monerooResponse = response.data;

      if (!monerooResponse.success) {
        console.error('❌ Erreur Moneroo:', monerooResponse);
        throw new BadRequestException('Erreur lors de l\'initialisation du paiement');
      }

      const paymentId = monerooResponse.data.id;
      const checkoutUrl = monerooResponse.data.checkout_url;

      if (!paymentId || !checkoutUrl) {
        console.error('❌ Données Moneroo manquantes:', JSON.stringify(monerooResponse, null, 2));
        throw new BadRequestException('Données de paiement Moneroo incomplètes');
      }

      console.log('✅ Paiement Moneroo créé:', paymentId);
      console.log('🔗 URL de paiement:', checkoutUrl);

      // Créer l'enregistrement dans la base de données
      const purchase = await this.prisma.creditPurchase.create({
        data: {
          userId,
          amount: BigInt(amountFcfa),
          creditsAmount: BigInt(dto.creditsAmount),
          currency: 'XOF',
          monerooPaymentId: paymentId,
          status: 'PENDING',
          customerEmail: user.email,
          customerPhone: user.phone,
          returnUrl,
          checkoutUrl,
          metadata: paymentData.metadata,
        },
      });

      return {
        purchaseId: purchase.id,
        checkoutUrl,
        monerooPaymentId: paymentId,
        amount: amountFcfa,
        creditsAmount: dto.creditsAmount,
      };
    } catch (error) {
      console.error('❌ Erreur Moneroo:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Erreur lors de la création du paiement',
      );
    }
  }

  /**
   * Vérifier un paiement Moneroo
   */
  async verifyPayment(monerooPaymentId: string) {
    if (!this.monerooApiKey) {
      throw new BadRequestException('Clé Moneroo non configurée');
    }

    try {
      const response = await axios.get(
        `${this.monerooApiUrl}/payments/${monerooPaymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.monerooApiKey}`,
            'Accept': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Erreur vérification Moneroo:', error.response?.data || error.message);
      throw new BadRequestException('Erreur lors de la vérification du paiement');
    }
  }

  /**
   * Traiter le webhook de Moneroo après paiement
   */
  async handleWebhook(webhookData: any) {
    try {
      const { id: monerooPaymentId, status, metadata } = webhookData;

      if (!monerooPaymentId) {
        console.error('ID de paiement Moneroo manquant dans le webhook');
        return { success: false, message: 'ID de paiement manquant' };
      }

      // Trouver l'achat de crédits correspondant
      const purchase = await this.prisma.creditPurchase.findUnique({
        where: { monerooPaymentId },
        include: { user: true },
      });

      if (!purchase) {
        console.error('Achat introuvable pour le paiement Moneroo:', monerooPaymentId);
        return { success: false, message: 'Achat introuvable' };
      }

      // Si déjà traité, ignorer
      if (purchase.status === 'COMPLETED') {
        return { success: true, message: 'Déjà traité' };
      }

      // Vérifier le statut du paiement Moneroo
      if (status === 'success' || status === 'successful' || status === 'completed') {
        // Paiement réussi, créditer le wallet
        await this.prisma.$transaction(async (tx) => {
          // Mettre à jour le statut de l'achat
          await tx.creditPurchase.update({
            where: { id: purchase.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          });

          // Créditer le wallet de l'utilisateur
          const wallet = await tx.wallet.upsert({
            where: { userId: purchase.userId },
            create: {
              userId: purchase.userId,
              balanceCredits: purchase.creditsAmount,
            },
            update: {
              balanceCredits: {
                increment: purchase.creditsAmount,
              },
            },
          });

          // Créer une transaction wallet
          await tx.walletTransaction.create({
            data: {
              walletId: wallet.id,
              type: 'CREDIT',
              amount: purchase.creditsAmount,
              reason: `Achat de ${purchase.creditsAmount} crédits via Moneroo (${purchase.amount.toString()} FCFA)`,
              relatedEntityType: 'CREDIT_PURCHASE',
              relatedEntityId: purchase.id,
            },
          });
        });

        console.log(`✅ Paiement Moneroo réussi - ${purchase.creditsAmount} crédits ajoutés à ${purchase.user.email}`);

        return { success: true, message: 'Crédits ajoutés avec succès' };
      } else if (status === 'failed' || status === 'error') {
        // Paiement échoué
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'FAILED' },
        });

        console.log(`❌ Paiement Moneroo échoué pour ${purchase.user.email}`);
        return { success: false, message: 'Paiement échoué' };
      } else if (status === 'cancelled' || status === 'canceled') {
        // Paiement annulé
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'CANCELLED' },
        });

        console.log(`⚠️  Paiement Moneroo annulé pour ${purchase.user.email}`);
        return { success: false, message: 'Paiement annulé' };
      }

      return { success: false, message: 'Statut inconnu: ' + status };
    } catch (error) {
      console.error('Erreur traitement webhook Moneroo:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'historique des achats de crédits d'un utilisateur
   */
  async getPurchaseHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      this.prisma.creditPurchase.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.creditPurchase.count({
        where: { userId },
      }),
    ]);

    return {
      purchases: purchases.map(p => ({
        ...p,
        amount: p.amount.toString(),
        creditsAmount: p.creditsAmount.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Vérifier manuellement un paiement et créditer si succès
   */
  async checkAndCompletePayment(purchaseId: string) {
    const purchase = await this.prisma.creditPurchase.findUnique({
      where: { id: purchaseId },
      include: { user: true },
    });

    if (!purchase) {
      throw new BadRequestException('Achat introuvable');
    }

    if (purchase.status === 'COMPLETED') {
      return { success: true, message: 'Paiement déjà traité' };
    }

    if (!purchase.monerooPaymentId) {
      throw new BadRequestException('ID de paiement Moneroo manquant');
    }

    // Vérifier le statut auprès de Moneroo
    const monerooStatus = await this.verifyPayment(purchase.monerooPaymentId);

    // Traiter selon le statut
    return this.handleWebhook(monerooStatus.data);
  }
}

