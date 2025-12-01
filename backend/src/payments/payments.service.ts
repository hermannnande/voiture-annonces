import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { AuditService } from '../audit/audit.service';
import { InitializePaymentDto } from './dto';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly fedapayApiUrl = 'https://api.fedapay.com/v1';
  private readonly fedapaySecretKey: string;
  private readonly fedapayPublicKey: string;

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private auditService: AuditService,
  ) {
    this.fedapaySecretKey = process.env.FEDAPAY_SECRET_KEY || process.env.MONEROO_SECRET_KEY || '';
    this.fedapayPublicKey = process.env.FEDAPAY_PUBLIC_KEY || process.env.MONEROO_PUBLIC_KEY || '';

    if (!this.fedapaySecretKey || !this.fedapayPublicKey) {
      console.warn('⚠️  Clés FedaPay non configurées. Le système de paiement automatique sera désactivé.');
    } else {
      console.log('✅ FedaPay configuré avec succès - Paiement automatique activé 🚀');
      console.log('📌 Public Key:', this.fedapayPublicKey.substring(0, 15) + '...');
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
    if (!this.fedapaySecretKey || !this.fedapayPublicKey) {
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
    const firstname = nameParts[0] || user.name;
    const lastname = nameParts.slice(1).join(' ') || 'Client';

    // Préparer les données pour FedaPay
    const transactionData = {
      description: `Achat de ${dto.creditsAmount} crédits - ${dto.packName || 'Pack personnalisé'}`,
      amount: amountFcfa,
      currency: {
        iso: 'XOF', // Franc CFA
      },
      callback_url: returnUrl,
      customer: {
        firstname,
        lastname,
        email: user.email,
        ...(user.phone && {
          phone_number: {
            number: user.phone,
            country: 'ci', // Côte d'Ivoire
          },
        }),
      },
      custom_metadata: {
        user_id: userId,
        credits_amount: dto.creditsAmount.toString(),
        pack_name: dto.packName || 'custom',
      },
    };

    try {
      console.log('🔄 Initialisation paiement FedaPay...', { amount: amountFcfa, credits: dto.creditsAmount });

      // Étape 1 : Créer la transaction FedaPay
      const transactionResponse = await axios.post(
        `${this.fedapayApiUrl}/transactions`,
        transactionData,
        {
          headers: {
            'Authorization': `Bearer ${this.fedapaySecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const transaction = transactionResponse.data.v1?.transaction || transactionResponse.data;
      const transactionId = transaction.id;

      if (!transactionId) {
        throw new BadRequestException('ID de transaction FedaPay manquant');
      }

      console.log('✅ Transaction FedaPay créée:', transactionId);

      // Étape 2 : Générer le token pour obtenir l'URL de paiement
      const tokenResponse = await axios.put(
        `${this.fedapayApiUrl}/transactions/${transactionId}/token`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.fedapaySecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const tokenData = tokenResponse.data.v1?.transaction || tokenResponse.data;
      const checkoutUrl = tokenData.url || `https://checkout.fedapay.com/${tokenData.token}`;

      console.log('✅ URL de paiement générée:', checkoutUrl);

      // Créer l'enregistrement dans la base de données
      const purchase = await this.prisma.creditPurchase.create({
        data: {
          userId,
          amount: BigInt(amountFcfa),
          creditsAmount: BigInt(dto.creditsAmount),
          currency: 'XOF',
          monerooPaymentId: transactionId.toString(), // On garde ce champ pour l'ID FedaPay
          status: 'PENDING',
          customerEmail: user.email,
          customerPhone: user.phone,
          returnUrl,
          checkoutUrl,
          metadata: transactionData.custom_metadata,
        },
      });

      return {
        purchaseId: purchase.id,
        checkoutUrl,
        fedapayTransactionId: transactionId,
        amount: amountFcfa,
        creditsAmount: dto.creditsAmount,
      };
    } catch (error) {
      console.error('❌ Erreur FedaPay:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Erreur lors de la création du paiement',
      );
    }
  }

  /**
   * Vérifier un paiement FedaPay
   */
  async verifyPayment(fedapayTransactionId: string) {
    if (!this.fedapaySecretKey) {
      throw new BadRequestException('Clés FedaPay non configurées');
    }

    try {
      const response = await axios.get(
        `${this.fedapayApiUrl}/transactions/${fedapayTransactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.fedapaySecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Erreur vérification FedaPay:', error.response?.data || error.message);
      throw new BadRequestException('Erreur lors de la vérification du paiement');
    }
  }

  /**
   * Traiter le webhook de FedaPay après paiement
   */
  async handleWebhook(webhookData: any) {
    try {
      // FedaPay envoie les données dans différents formats possibles
      const transaction = webhookData.entity || webhookData.transaction || webhookData;
      const fedapayTransactionId = transaction.id?.toString();
      const status = transaction.status;

      if (!fedapayTransactionId) {
        console.error('ID de transaction FedaPay manquant dans le webhook');
        return { success: false, message: 'ID de transaction manquant' };
      }

      // Trouver l'achat de crédits correspondant
      const purchase = await this.prisma.creditPurchase.findUnique({
        where: { monerooPaymentId: fedapayTransactionId }, // On utilise ce champ pour FedaPay aussi
        include: { user: true },
      });

      if (!purchase) {
        console.error('Achat introuvable pour la transaction FedaPay:', fedapayTransactionId);
        return { success: false, message: 'Achat introuvable' };
      }

      // Si déjà traité, ignorer
      if (purchase.status === 'COMPLETED') {
        return { success: true, message: 'Déjà traité' };
      }

      // Vérifier le statut du paiement FedaPay
      if (status === 'approved' || status === 'transferred') {
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
              reason: `Achat de ${purchase.creditsAmount} crédits via FedaPay (${purchase.amount.toString()} FCFA)`,
              relatedEntityType: 'CREDIT_PURCHASE',
              relatedEntityId: purchase.id,
            },
          });
        });

        console.log(`✅ Paiement FedaPay réussi - ${purchase.creditsAmount} crédits ajoutés à ${purchase.user.email}`);

        return { success: true, message: 'Crédits ajoutés avec succès' };
      } else if (status === 'declined' || status === 'canceled') {
        // Paiement échoué ou annulé
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: status === 'declined' ? 'FAILED' : 'CANCELLED' },
        });

        console.log(`❌ Paiement FedaPay ${status} pour ${purchase.user.email}`);
        return { success: false, message: `Paiement ${status}` };
      }

      return { success: false, message: 'Statut inconnu: ' + status };
    } catch (error) {
      console.error('Erreur traitement webhook FedaPay:', error);
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

