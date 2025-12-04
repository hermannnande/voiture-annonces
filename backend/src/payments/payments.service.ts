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
    
    // ✅ Nettoyer FRONTEND_URL pour ne garder que la première URL (au cas où plusieurs URLs séparées par virgule)
    const rawFrontendUrl = process.env.FRONTEND_URL || 'https://www.annonceauto.ci';
    this.frontendUrl = rawFrontendUrl.split(',')[0].trim();
    
    // ✅ Nettoyer BACKEND_URL de la même façon
    const rawBackendUrl = process.env.BACKEND_URL || 'https://api.annonceauto.ci/api';
    this.backendUrl = rawBackendUrl.split(',')[0].trim();

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
      console.log('🔄 Version: 2024-12-02 13:00 (Redirection mobile corrigée - FORCE DEPLOY)');
      console.log('🎯 FRONTEND_URL nettoyée pour éviter URLs multiples séparées par virgule');
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
    // ✅ Payfonte redirige DIRECTEMENT vers le frontend (pas d'étape intermédiaire sur API)
    const redirectURL = `${this.frontendUrl}/dashboard/wallet/payment-result`;
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
   * Initialiser un paiement Payfonte pour boost d'annonce
   */
  async initializeBoostPayment(userId: string, dto: any) {
    if (!this.payfonteClientId || !this.payfonteClientSecret) {
      throw new BadRequestException('Le système de paiement automatique n\'est pas configuré');
    }

    // Récupérer l'utilisateur et le produit boost
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    // Récupérer le produit boost
    const boostProduct = await this.prisma.boostProduct.findUnique({
      where: { id: dto.boostProductId },
    });

    if (!boostProduct) {
      throw new BadRequestException('Produit de boost introuvable');
    }

    // Calculer le montant en FCFA (multiplié par 100 pour Payfonte)
    const amountFcfa = parseInt(boostProduct.priceFcfa.toString());
    const amountPayfonte = amountFcfa * 100;

    // Générer une référence unique
    const reference = `BOOST_${userId.substring(0, 8)}_${Date.now()}`;

    // URLs de callback et webhook
    // ✅ Payfonte redirige DIRECTEMENT vers le frontend (pas d'étape intermédiaire sur API)
    const redirectURL = `${this.frontendUrl}/dashboard/listings`;
    const webhookURL = `${this.backendUrl}/payments/webhook/payfonte`;

    // Nettoyer le numéro de téléphone
    let phoneNumber = user.phone || '+2250778030075';
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber.replace(/\D/g, '');
    }

    // Préparer les données pour Payfonte
    const paymentData = {
      reference,
      amount: amountPayfonte, // Multiplier par 100 pour Payfonte
      redirectURL,
      country: 'CI',
      currency: 'XOF',
      customerBearsCharge: false,
      webhook: webhookURL,
      user: {
        email: user.email,
        phoneNumber,
        name: user.name,
      },
      narration: `Boost annonce - ${boostProduct.name} (${boostProduct.durationDays} jours)`,
    };

    try {
      console.log('🔄 Initialisation paiement Payfonte (boost)...');
      console.log('  📊 Détails:', {
        userId,
        userEmail: user.email,
        boostProductId: dto.boostProductId,
        boostProductName: boostProduct.name,
        listingId: dto.listingId,
        amountFcfa,
        amountPayfonte,
        reference,
      });
      console.log('  💰 MONTANT RÉEL:', amountFcfa, 'FCFA');
      console.log('  💰 MONTANT ENVOYÉ À PAYFONTE (×100):', amountPayfonte);

      // Appeler l'API Payfonte
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

      // Enregistrer dans la base (on réutilise creditPurchase avec metadata spécifique)
      const purchase = await this.prisma.creditPurchase.create({
        data: {
          userId,
          amount: BigInt(amountFcfa),
          creditsAmount: BigInt(0), // Pas de crédits, c'est un boost direct
          currency: 'XOF',
          monerooPaymentId: reference,
          status: 'PENDING',
          customerEmail: user.email,
          customerPhone: user.phone,
          returnUrl: dto.returnUrl || `${this.frontendUrl}/dashboard/listings`,
          checkoutUrl,
          metadata: {
            payfonte_payment_id: paymentId,
            payfonte_reference: reference,
            type: 'BOOST',
            user_id: userId,
            listing_id: dto.listingId,
            boost_product_id: dto.boostProductId,
            boost_product_name: boostProduct.name,
            boost_duration_days: boostProduct.durationDays,
          },
        },
      });

      return {
        purchaseId: purchase.id,
        checkoutUrl,
        payfontePaymentId: paymentId,
        reference,
        amount: amountFcfa,
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

      console.log(`🔍 VERIFY API RAW RESPONSE for ${reference}:`, JSON.stringify(response.data, null, 2));
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
      console.log('📥 Webhook Payfonte reçu (raw):', JSON.stringify(webhookData, null, 2));

      // ✅ Extraction intelligente des données
      // Payfonte envoie souvent { data: { ... } }
      let data = webhookData;
      if (webhookData.data) {
        data = webhookData.data;
      }

      const { reference, status, amount } = data;

      if (!reference) {
        console.error('❌ Référence de paiement Payfonte manquante dans le webhook');
        return { success: false, message: 'Référence de paiement manquante' };
      }

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
   * 🔄 SYSTÈME DE RÉCONCILIATION AUTOMATIQUE
   * Vérifie tous les paiements PENDING auprès de Payfonte et les crédite si payés
   * À appeler périodiquement (ex: toutes les 5 minutes via cron ou manuellement)
   */
  async reconcilePendingPayments() {
    console.log('🔄 Début réconciliation des paiements en attente...');
    
    try {
      // Récupérer tous les paiements en attente (PENDING) des dernières 24h
      const pendingPayments = await this.prisma.creditPurchase.findMany({
        where: {
          status: 'PENDING',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Dernières 24h
          },
        },
        include: { user: true },
      });

      console.log(`📊 ${pendingPayments.length} paiement(s) en attente trouvé(s)`);

      if (pendingPayments.length === 0) {
        return { 
          success: true, 
          message: 'Aucun paiement en attente',
          checked: 0,
          credited: 0,
          failed: 0,
        };
      }

      let credited = 0;
      let failed = 0;

      // Vérifier chaque paiement auprès de Payfonte
      for (const payment of pendingPayments) {
        try {
          console.log(`🔍 Vérification paiement ${payment.id} (ref: ${payment.monerooPaymentId})...`);

          if (!payment.monerooPaymentId) {
            console.log(`⚠️  Pas de référence Payfonte pour ${payment.id}, skip`);
            continue;
          }

          // Vérifier le statut auprès de Payfonte
          const response = await axios.get(
            `${this.payfonteApiUrl}/checkouts/${payment.monerooPaymentId}`,
            {
              headers: {
                'client-id': this.payfonteClientId,
                'client-secret': this.payfonteClientSecret,
                'Content-Type': 'application/json',
              },
            }
          );

          console.log(`🔍 RECONCILE API RAW RESPONSE for ${payment.monerooPaymentId}:`, JSON.stringify(response.data, null, 2));

          // ✅ Extraction intelligente des données
          // Payfonte peut renvoyer { data: { status: 'success' } } ou juste { status: 'success' }
          let payfonteData = response.data;
          if (response.data && response.data.data) {
            payfonteData = response.data.data;
          }
          
          const payfonteStatus = payfonteData?.status;
          
          console.log(`📌 Statut Payfonte extrait pour ${payment.id}: ${payfonteStatus}`);

          // Si le paiement est réussi, créditer le compte
          if (payfonteStatus === 'successful' || payfonteStatus === 'success' || payfonteStatus === 'succe-s' || payfonteStatus === 'completed') {
            // Vérifier que le paiement n'a pas déjà été traité (idempotence)
            const currentPayment = await this.prisma.creditPurchase.findUnique({
              where: { id: payment.id },
            });

            if (currentPayment.status === 'COMPLETED') {
              console.log(`✅ Paiement ${payment.id} déjà complété, skip`);
              continue;
            }

            // Créditer le wallet
            await this.prisma.$transaction(async (prisma) => {
              // 1. Mettre à jour le statut du paiement
              await prisma.creditPurchase.update({
                where: { id: payment.id },
                data: {
                  status: 'COMPLETED',
                  completedAt: new Date(),
                },
              });

              // 2. Créditer le wallet
              const wallet = await prisma.wallet.findUnique({
                where: { userId: payment.userId },
              });

              if (wallet) {
                await prisma.wallet.update({
                  where: { userId: payment.userId },
                  data: {
                    balanceCredits: {
                      increment: payment.creditsAmount,
                    },
                  },
                });

                console.log(`💰 ${payment.creditsAmount} crédits ajoutés au wallet de ${payment.user.email}`);
              } else {
                // Créer le wallet s'il n'existe pas
                await prisma.wallet.create({
                  data: {
                    userId: payment.userId,
                    balanceCredits: payment.creditsAmount,
                  },
                });
                console.log(`💰 Wallet créé avec ${payment.creditsAmount} crédits pour ${payment.user.email}`);
              }
            });

            credited++;
            console.log(`✅ Paiement ${payment.id} crédité automatiquement via réconciliation`);
          } else if (payfonteStatus === 'failed' || payfonteStatus === 'error') {
            // Marquer comme échoué
            await this.prisma.creditPurchase.update({
              where: { id: payment.id },
              data: {
                status: 'FAILED',
              },
            });
            failed++;
            console.log(`❌ Paiement ${payment.id} marqué comme échoué`);
          } else {
            console.log(`⏳ Paiement ${payment.id} toujours en attente (statut: ${payfonteStatus})`);
          }
        } catch (error) {
          console.error(`❌ Erreur vérification paiement ${payment.id}:`, error.message);
          continue;
        }
      }

      const result = {
        success: true,
        message: 'Réconciliation terminée',
        checked: pendingPayments.length,
        credited,
        failed,
      };

      console.log('✅ Réconciliation terminée:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur réconciliation:', error);
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

  /**
   * Gérer le callback de retour boost Payfonte
   */
  async handleCallbackBoost(reference: string, status: string) {
    console.log('🔄 Callback Payfonte BOOST reçu:', { reference, status });

    if (!reference) {
      return {
        redirect: `${this.frontendUrl}/dashboard/listings?payment=error&message=Référence manquante`,
      };
    }

    try {
      // Trouver l'achat correspondant
      const purchase = await this.prisma.creditPurchase.findUnique({
        where: { monerooPaymentId: reference },
        include: { user: true },
      });

      if (!purchase) {
        return {
          redirect: `${this.frontendUrl}/dashboard/listings?payment=error&message=Paiement introuvable`,
        };
      }

      // Vérifier le statut auprès de Payfonte
      let verifiedStatus = status;
      try {
        const verification = await this.verifyPayment(reference);
        verifiedStatus = verification.data?.status || status;
        console.log('✅ Statut vérifié auprès de Payfonte:', verifiedStatus);
      } catch (error) {
        console.warn('⚠️  Impossible de vérifier auprès de Payfonte, utilisation du statut reçu');
      }

      const metadata = purchase.metadata as any;

      // Traiter selon le statut
      if (verifiedStatus === 'success' || verifiedStatus === 'successful' || verifiedStatus === 'completed' || verifiedStatus === 'SUCCESSFUL') {
        console.log('✅ Paiement boost réussi, activation du boost...');
        console.log('📊 Détails:', {
          userId: purchase.userId,
          listingId: metadata.listing_id,
          boostProductId: metadata.boost_product_id,
          durationDays: metadata.boost_duration_days,
        });

        // Activer le boost
        await this.prisma.$transaction(async (tx) => {
          // Mettre à jour le statut de l'achat
          await tx.creditPurchase.update({
            where: { id: purchase.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          });

          // Activer le boost pour l'annonce
          await tx.boost.create({
            data: {
              listingId: metadata.listing_id,
              buyerId: purchase.userId,
              boostProductId: metadata.boost_product_id,
              startsAt: new Date(),
              endsAt: new Date(Date.now() + metadata.boost_duration_days * 24 * 60 * 60 * 1000),
              paymentStatus: 'COMPLETED',
              paymentAmount: purchase.amount,
              paymentProvider: 'payfonte',
            },
          });

          console.log('  ✓ Boost activé avec succès');
        });

        console.log(`✅ Boost Payfonte réussi pour ${purchase.user.email}`);

        return {
          redirect: `${this.frontendUrl}/dashboard/listings?payment=success&boost=activated`,
        };
      } else if (verifiedStatus === 'failed' || verifiedStatus === 'FAILED') {
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'FAILED' },
        });

        return {
          redirect: `${this.frontendUrl}/dashboard/listings?payment=failed`,
        };
      } else if (verifiedStatus === 'cancelled' || verifiedStatus === 'canceled' || verifiedStatus === 'CANCELLED') {
        await this.prisma.creditPurchase.update({
          where: { id: purchase.id },
          data: { status: 'CANCELLED' },
        });

        return {
          redirect: `${this.frontendUrl}/dashboard/listings?payment=cancelled`,
        };
      } else {
        return {
          redirect: `${this.frontendUrl}/dashboard/listings?payment=pending`,
        };
      }
    } catch (error) {
      console.error('❌ Erreur callback boost Payfonte:', error);
      return {
        redirect: `${this.frontendUrl}/dashboard/listings?payment=error&message=${encodeURIComponent(error.message)}`,
      };
    }
  }

}

