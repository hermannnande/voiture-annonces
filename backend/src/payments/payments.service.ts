import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { AuditService } from '../audit/audit.service';
import { InitializePaymentDto } from './dto';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly monerooApiUrl = 'https://api.moneroo.io/v1';
  private readonly monerooApiKey: string;
  private readonly monerooWebhookSecret: string;
  private readonly frontendUrl: string;

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private auditService: AuditService,
  ) {
    this.monerooApiKey = process.env.MONEROO_API_KEY || '';
    this.monerooWebhookSecret = process.env.MONEROO_WEBHOOK_SECRET || '';
    this.frontendUrl = process.env.FRONTEND_URL || 'https://www.annonceauto.ci';

    if (!this.monerooApiKey) {
      console.warn('⚠️  Clé Moneroo non configurée. Le système de paiement automatique sera désactivé.');
    } else {
      console.log('✅ Moneroo configuré avec succès - Paiement automatique activé 🚀');
      console.log('📌 API Key:', this.monerooApiKey.substring(0, 15) + '...');
    }

    if (!this.monerooWebhookSecret) {
      console.warn('⚠️  Secret webhook Moneroo non configuré. Les webhooks ne seront pas vérifiés.');
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

    // URL de callback backend (Moneroo redirige ici après paiement)
    const backendCallbackUrl = `${process.env.BACKEND_URL || 'https://api.annonceauto.ci/api'}/payments/moneroo/callback`;
    
    // URL de retour frontend (après traitement du callback)
    const returnUrl = dto.returnUrl || `${this.frontendUrl}/dashboard/wallet/payment-result`;

    // Extraire le prénom et nom
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || user.name;
    const lastName = nameParts.slice(1).join(' ') || 'Client';

    // Nettoyer le numéro de téléphone (Moneroo veut un entier sans +)
    let cleanPhone: string | undefined = undefined;
    if (user.phone) {
      // Retirer tous les caractères non numériques
      cleanPhone = user.phone.replace(/\D/g, '');
      // Si le numéro ne commence pas par l'indicatif pays, on ne l'envoie pas
      if (cleanPhone.length < 10) {
        cleanPhone = undefined;
      }
    }

    // Préparer les données pour Moneroo
    const paymentData: any = {
      amount: amountFcfa,
      currency: 'XOF', // Franc CFA
      description: `Achat de ${dto.creditsAmount} crédits - ${dto.packName || 'Pack personnalisé'}`,
      return_url: backendCallbackUrl, // Moneroo redirige vers le backend d'abord
      customer: {
        email: user.email,
        first_name: firstName,
        last_name: lastName,
      },
      metadata: {
        user_id: userId,
        credits_amount: dto.creditsAmount.toString(),
        pack_name: dto.packName || 'custom',
        frontend_return_url: returnUrl, // URL frontend finale
      },
    };

    // Ajouter le téléphone seulement s'il est valide
    if (cleanPhone) {
      paymentData.customer.phone = cleanPhone;
    }

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

      // Moneroo retourne errors: null en cas de succès, pas success: true
      if (monerooResponse.errors !== null) {
        console.error('❌ Erreur Moneroo:', monerooResponse);
        throw new BadRequestException(
          monerooResponse.message || 'Erreur lors de l\'initialisation du paiement'
        );
      }

      const paymentId = monerooResponse.data?.id;
      const checkoutUrl = monerooResponse.data?.checkout_url;

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

  /**
   * Gérer le callback de retour de Moneroo
   * Moneroo redirige vers cette URL avec ?monerooPaymentId=xxx&monerooPaymentStatus=xxx
   */
  async handleCallback(monerooPaymentId: string, status: string) {
    console.log('🔄 Callback Moneroo reçu:', { monerooPaymentId, status });

    if (!monerooPaymentId) {
      return {
        redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=error&message=ID manquant`,
      };
    }

    try {
      // Trouver l'achat correspondant
      const purchase = await this.prisma.creditPurchase.findUnique({
        where: { monerooPaymentId },
        include: { user: true },
      });

      if (!purchase) {
        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=error&message=Achat introuvable`,
        };
      }

      // Vérifier le statut auprès de Moneroo pour sécurité
      const verification = await this.verifyPayment(monerooPaymentId);
      const verifiedStatus = verification.data?.status || status;

      console.log('✅ Statut vérifié:', verifiedStatus);

      // Traiter le paiement selon le statut
      if (verifiedStatus === 'success' || verifiedStatus === 'successful' || verifiedStatus === 'completed') {
        // Créditer le wallet
        await this.handleWebhook({
          id: monerooPaymentId,
          status: verifiedStatus,
          metadata: purchase.metadata,
        });

        // Récupérer l'URL de retour frontend depuis les metadata
        const frontendReturnUrl = (purchase.metadata as any)?.frontend_return_url || `${this.frontendUrl}/dashboard/wallet/payment-result`;

        return {
          redirect: `${frontendReturnUrl}?status=success&amount=${purchase.creditsAmount.toString()}&monerooPaymentId=${monerooPaymentId}`,
        };
      } else if (verifiedStatus === 'failed' || verifiedStatus === 'error') {
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'FAILED' },
        });

        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=failed&monerooPaymentId=${monerooPaymentId}`,
        };
      } else if (verifiedStatus === 'cancelled' || verifiedStatus === 'canceled') {
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'CANCELLED' },
        });

        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=cancelled&monerooPaymentId=${monerooPaymentId}`,
        };
      } else {
        // Statut en attente ou inconnu
        return {
          redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=pending&monerooPaymentId=${monerooPaymentId}`,
        };
      }
    } catch (error) {
      console.error('❌ Erreur callback Moneroo:', error);
      return {
        redirect: `${this.frontendUrl}/dashboard/wallet/payment-result?status=error&message=${encodeURIComponent(error.message)}`,
      };
    }
  }

  /**
   * Vérifier la signature d'un webhook Moneroo (HMAC-SHA256)
   * Doc: https://docs.moneroo.io/webhooks/verify-signature
   */
  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    if (!this.monerooWebhookSecret) {
      console.warn('⚠️  Secret webhook non configuré, signature non vérifiée');
      return true; // Accepter quand même si pas configuré (pour développement)
    }

    if (!signature) {
      console.error('❌ Signature manquante dans le webhook');
      return false;
    }

    try {
      // Calculer la signature HMAC-SHA256
      const expectedSignature = crypto
        .createHmac('sha256', this.monerooWebhookSecret)
        .update(payload)
        .digest('hex');

      // Comparer les signatures de manière sécurisée
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch (error) {
      console.error('❌ Erreur vérification signature:', error);
      return false;
    }
  }
}

