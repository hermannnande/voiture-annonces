import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { AuditService } from '../audit/audit.service';
import { InitializePaymentDto } from './dto';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly payfonteApiUrl: string;
  private readonly payfonteClientId: string;
  private readonly payfonteClientSecret: string;
  private readonly frontendUrl: string;
  private readonly backendUrl: string;

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private auditService: AuditService,
  ) {
    this.payfonteClientId = process.env.PAYFONTE_CLIENT_ID || '';
    this.payfonteClientSecret = process.env.PAYFONTE_CLIENT_SECRET || '';
    this.frontendUrl = process.env.FRONTEND_URL || 'https://www.annonceauto.ci';
    this.backendUrl = process.env.BACKEND_URL || 'https://api.annonceauto.ci/api';

    // Déterminer l'environnement (sandbox ou production)
    const isProduction = this.payfonteClientSecret.startsWith('live_');
    this.payfonteApiUrl = isProduction
      ? 'https://api.payfonte.com/payments/v1'
      : 'https://sandbox-api.payfonte.com/payments/v1';

    if (!this.payfonteClientId || !this.payfonteClientSecret) {
      console.warn('⚠️  Credentials Payfonte non configurés. Le système de paiement automatique sera désactivé.');
    } else {
      console.log('✅ Payfonte configuré avec succès - Paiement automatique activé 🚀');
      console.log('📌 Client ID:', this.payfonteClientId);
      console.log('📌 Environment:', isProduction ? 'PRODUCTION' : 'SANDBOX');
      console.log('📌 API URL:', this.payfonteApiUrl);
      console.log('📌 Frontend URL:', this.frontendUrl);
      console.log('📌 Backend URL:', this.backendUrl);
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
   * Initialiser un paiement Payfonte pour acheter des crédits
   */
  async initializePayment(userId: string, dto: InitializePaymentDto) {
    if (!this.payfonteClientId || !this.payfonteClientSecret) {
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

    // Générer une référence unique
    const reference = `CREDIT_${userId.substring(0, 8)}_${Date.now()}`;

    // URLs de callback et webhook
    const redirectURL = `${this.backendUrl}/payments/payfonte/callback`;
    const webhookURL = `${this.backendUrl}/payments/webhook/payfonte`;

    // Nettoyer le numéro de téléphone (format international avec +)
    let phoneNumber = user.phone || '+2250778030075'; // Numéro par défaut si pas de téléphone
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber.replace(/\D/g, '');
    }

    // Préparer les données pour Payfonte
    // IMPORTANT : Payfonte attend le montant en "plus petite unité" (centimes)
    // Donc pour 500 FCFA, on envoie 50000 (500 × 100)
    const paymentData = {
      reference,
      amount: amountFcfa * 100, // Multiplier par 100 pour Payfonte
      redirectURL,
      country: 'CI', // Côte d'Ivoire
      currency: 'XOF', // Franc CFA
      customerBearsCharge: false, // Le marchand paie les frais
      webhook: webhookURL,
      user: {
        email: user.email,
        phoneNumber,
        name: user.name,
      },
      narration: `Achat de ${dto.creditsAmount} crédits - ${dto.packName || 'Pack personnalisé'}`,
    };

    try {
      console.log('🔄 Initialisation paiement Payfonte...');
      console.log('  📊 Détails:', {
        userId,
        userEmail: user.email,
        creditsAmount: dto.creditsAmount,
        amountFcfa,
        amountPayfonte: amountFcfa * 100,
        reference,
      });
      console.log('  💰 MONTANT RÉEL:', amountFcfa, 'FCFA');
      console.log('  💰 MONTANT ENVOYÉ À PAYFONTE (×100):', amountFcfa * 100);

      // Appeler l'API Payfonte pour créer un checkout
      const response = await axios.post(
        `${this.payfonteApiUrl}/checkouts`,
        paymentData,
        {
          headers: {
            'client-id': this.payfonteClientId,
            'client-secret': this.payfonteClientSecret,
            'Content-Type': 'application/json',
          },
        },
      );

      const payfonteResponse = response.data;

      if (!payfonteResponse.data || !payfonteResponse.data.shortURL) {
        console.error('❌ Données Payfonte manquantes:', JSON.stringify(payfonteResponse, null, 2));
        throw new BadRequestException('Données de paiement Payfonte incomplètes');
      }

      const paymentId = payfonteResponse.data.id;
      const checkoutUrl = payfonteResponse.data.shortURL || payfonteResponse.data.url;

      console.log('✅ Paiement Payfonte créé:', paymentId);
      console.log('🔗 URL de paiement:', checkoutUrl);
      console.log('📝 Référence:', reference);

      // Créer l'enregistrement dans la base de données
      const purchase = await this.prisma.creditPurchase.create({
        data: {
          userId,
          amount: BigInt(amountFcfa),
          creditsAmount: BigInt(dto.creditsAmount),
          currency: 'XOF',
          monerooPaymentId: reference, // On utilise la référence Payfonte
          status: 'PENDING',
          customerEmail: user.email,
          customerPhone: user.phone,
          returnUrl: dto.returnUrl || `${this.frontendUrl}/dashboard/wallet/payment-result`,
          checkoutUrl,
          metadata: {
            payfonte_payment_id: paymentId,
            payfonte_reference: reference,
            user_id: userId,
            credits_amount: dto.creditsAmount.toString(),
            pack_name: dto.packName || 'custom',
          },
        },
      });

      return {
        purchaseId: purchase.id,
        checkoutUrl,
        payfontePaymentId: paymentId,
        reference,
        amount: amountFcfa,
        creditsAmount: dto.creditsAmount,
      };
    } catch (error) {
      console.error('❌ Erreur Payfonte:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Erreur lors de la création du paiement',
      );
    }
  }

  /**
   * Vérifier un paiement Payfonte par référence
   */
  async verifyPayment(reference: string) {
    if (!this.payfonteClientId || !this.payfonteClientSecret) {
      throw new BadRequestException('Credentials Payfonte non configurés');
    }

    try {
      const response = await axios.get(
        `${this.payfonteApiUrl}/checkouts/${reference}`,
        {
          headers: {
            'client-id': this.payfonteClientId,
            'client-secret': this.payfonteClientSecret,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Erreur vérification Payfonte:', error.response?.data || error.message);
      throw new BadRequestException('Erreur lors de la vérification du paiement');
    }
  }

  /**
   * Traiter le webhook de Payfonte après paiement
   */
  async handleWebhook(webhookData: any) {
    try {
      const { reference, status, amount } = webhookData;

      if (!reference) {
        console.error('Référence de paiement Payfonte manquante dans le webhook');
        return { success: false, message: 'Référence de paiement manquante' };
      }

      console.log('📥 Webhook Payfonte reçu:', { reference, status, amount });

      // Trouver l'achat de crédits correspondant
      const purchase = await this.prisma.creditPurchase.findUnique({
        where: { monerooPaymentId: reference }, // On utilise monerooPaymentId pour stocker la référence
        include: { user: true },
      });

      if (!purchase) {
        console.error('Achat introuvable pour la référence Payfonte:', reference);
        return { success: false, message: 'Achat introuvable' };
      }

      // Si déjà traité, ignorer
      if (purchase.status === 'COMPLETED') {
        return { success: true, message: 'Déjà traité' };
      }

      // Vérifier le statut du paiement Payfonte
      if (status === 'success' || status === 'successful' || status === 'completed' || status === 'SUCCESSFUL') {
        console.log('💳 Début de la transaction de créditation...');
        
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
          console.log('  ✓ Statut purchase mis à jour: COMPLETED');

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
          console.log(`  ✓ Wallet mis à jour: +${purchase.creditsAmount} crédits (nouveau solde: ${wallet.balanceCredits.toString()})`);

          // Créer une transaction wallet
          await tx.walletTransaction.create({
            data: {
              walletId: wallet.id,
              type: 'CREDIT',
              amount: purchase.creditsAmount,
              reason: `Achat de ${purchase.creditsAmount} crédits via Payfonte (${purchase.amount.toString()} FCFA)`,
              relatedEntityType: 'CREDIT_PURCHASE',
              relatedEntityId: purchase.id,
            },
          });
          console.log('  ✓ Transaction wallet créée');
        });

        console.log(`✅ Paiement Payfonte réussi - ${purchase.creditsAmount} crédits ajoutés à ${purchase.user.email}`);
        console.log(`💰 Montant payé: ${purchase.amount.toString()} FCFA`);

        return { success: true, message: 'Crédits ajoutés avec succès' };
      } else if (status === 'failed' || status === 'FAILED' || status === 'error') {
        // Paiement échoué
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'FAILED' },
        });

        console.log(`❌ Paiement Payfonte échoué pour ${purchase.user.email}`);
        return { success: false, message: 'Paiement échoué' };
      } else if (status === 'cancelled' || status === 'canceled' || status === 'CANCELLED') {
        // Paiement annulé
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'CANCELLED' },
        });

        console.log(`⚠️  Paiement Payfonte annulé pour ${purchase.user.email}`);
        return { success: false, message: 'Paiement annulé' };
      }

      return { success: false, message: 'Statut inconnu: ' + status };
    } catch (error) {
      console.error('Erreur traitement webhook Payfonte:', error);
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
      throw new BadRequestException('Référence de paiement Payfonte manquante');
    }

    // Vérifier le statut auprès de Payfonte
    const payfonteStatus = await this.verifyPayment(purchase.monerooPaymentId);

    // Traiter selon le statut
    return this.handleWebhook(payfonteStatus.data);
  }

  /**
   * Gérer le callback de retour de Payfonte
   * Payfonte redirige vers cette URL avec ?reference=xxx&status=xxx
   */
  async handleCallback(reference: string, status: string) {
    console.log('🔄 Callback Payfonte reçu:', { reference, status });

    if (!reference) {
      return {
        redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=error&message=Référence manquante`,
      };
    }

    try {
      // Trouver l'achat correspondant
      const purchase = await this.prisma.creditPurchase.findUnique({
        where: { monerooPaymentId: reference }, // On utilise monerooPaymentId pour stocker la référence
        include: { user: true },
      });

      if (!purchase) {
        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=error&message=Achat introuvable`,
        };
      }

      // Vérifier le statut auprès de Payfonte pour sécurité
      let verifiedStatus = status;
      try {
        const verification = await this.verifyPayment(reference);
        verifiedStatus = verification.data?.status || status;
        console.log('✅ Statut vérifié auprès de Payfonte:', verifiedStatus);
      } catch (error) {
        console.warn('⚠️  Impossible de vérifier auprès de Payfonte, utilisation du statut reçu');
      }

      // Traiter le paiement selon le statut
      if (verifiedStatus === 'success' || verifiedStatus === 'successful' || verifiedStatus === 'completed' || verifiedStatus === 'SUCCESSFUL') {
        console.log('✅ Paiement réussi, créditation du wallet en cours...');
        console.log('📊 Détails:', {
          userId: purchase.userId,
          userEmail: purchase.user.email,
          creditsAmount: purchase.creditsAmount.toString(),
          amountPaid: purchase.amount.toString(),
        });
        
        // Créditer le wallet
        await this.handleWebhook({
          reference,
          status: verifiedStatus,
          amount: purchase.amount.toString(),
        });

        console.log('✅ Wallet crédité avec succès !');

        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=success&amount=${purchase.creditsAmount.toString()}&reference=${reference}`,
        };
      } else if (verifiedStatus === 'failed' || verifiedStatus === 'FAILED' || verifiedStatus === 'error') {
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'FAILED' },
        });

        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=failed&reference=${reference}`,
        };
      } else if (verifiedStatus === 'cancelled' || verifiedStatus === 'canceled' || verifiedStatus === 'CANCELLED') {
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'CANCELLED' },
        });

        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=cancelled&reference=${reference}`,
        };
      } else {
        // Statut en attente ou inconnu
        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=pending&reference=${reference}`,
        };
      }
    } catch (error) {
      console.error('❌ Erreur callback Payfonte:', error);
      return {
        redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=error&message=${encodeURIComponent(error.message)}`,
      };
    }
  }

}

