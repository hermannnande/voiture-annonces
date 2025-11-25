import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BoostsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async getBoostProducts() {
    const products = await this.prisma.boostProduct.findMany({
      where: { isActive: true },
      orderBy: { priceFcfa: 'asc' },
    });

    return products.map((product) => ({
      ...product,
      priceFcfa: product.priceFcfa.toString(),
      creditsCost: product.creditsCost.toString(),
    }));
  }

  async getBoostProductById(id: number) {
    const product = await this.prisma.boostProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produit de boost introuvable');
    }

    return {
      ...product,
      priceFcfa: product.priceFcfa.toString(),
      creditsCost: product.creditsCost.toString(),
    };
  }

  async purchaseBoost(
    userId: string,
    listingId: string,
    boostProductId: number,
    paymentProvider: string,
    ip?: string,
  ) {
    // Vérifier que l'annonce existe et appartient à l'utilisateur
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    if (listing.userId !== userId) {
      throw new BadRequestException('Cette annonce ne vous appartient pas');
    }

    // Vérifier que le produit de boost existe
    const boostProduct = await this.prisma.boostProduct.findUnique({
      where: { id: boostProductId },
    });

    if (!boostProduct || !boostProduct.isActive) {
      throw new NotFoundException('Produit de boost introuvable ou inactif');
    }

    // Calculer les dates de début et de fin
    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + boostProduct.durationDays);

    // Créer le boost
    const boost = await this.prisma.boost.create({
      data: {
        listingId,
        boostProductId,
        buyerId: userId,
        startsAt,
        endsAt,
        paymentStatus: 'COMPLETED',
        paymentAmount: boostProduct.priceFcfa,
        paymentProvider,
      },
      include: {
        boostProduct: true,
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Mettre à jour l'annonce
    await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        isSponsored: true,
        sponsoredUntil: endsAt,
        sponsoredPriority: boostProduct.priority,
      },
    });

    // Log d'audit
    await this.auditService.log({
      actorId: userId,
      action: 'BOOST_PURCHASED',
      targetType: 'Listing',
      targetId: listingId,
      meta: {
        boostProductId,
        amount: boostProduct.priceFcfa.toString(),
        durationDays: boostProduct.durationDays,
      },
      ip,
    });

    return {
      ...boost,
      paymentAmount: boost.paymentAmount.toString(),
      boostProduct: {
        ...boost.boostProduct,
        priceFcfa: boost.boostProduct.priceFcfa.toString(),
        creditsCost: boost.boostProduct.creditsCost.toString(),
      },
    };
  }

  /**
   * Acheter un boost avec des crédits wallet
   */
  async purchaseBoostWithCredits(
    userId: string,
    listingId: string,
    boostProductId: number,
    ip?: string,
  ) {
    // Vérifier que l'annonce existe et appartient à l'utilisateur
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    if (listing.userId !== userId) {
      throw new BadRequestException('Cette annonce ne vous appartient pas');
    }

    // Vérifier que le produit de boost existe
    const boostProduct = await this.prisma.boostProduct.findUnique({
      where: { id: boostProductId },
    });

    if (!boostProduct || !boostProduct.isActive) {
      throw new NotFoundException('Produit de boost introuvable ou inactif');
    }

    // Vérifier que le pack a un prix en crédits
    if (boostProduct.creditsCost <= 0) {
      throw new BadRequestException('Ce pack n\'est pas disponible en crédits');
    }

    // Obtenir ou créer le wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet introuvable');
    }

    // Vérifier le solde
    if (wallet.balanceCredits < boostProduct.creditsCost) {
      throw new BadRequestException(
        `Solde insuffisant. Vous avez ${wallet.balanceCredits} crédits, il en faut ${boostProduct.creditsCost}`,
      );
    }

    // Calculer les dates
    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + boostProduct.durationDays);

    // Transaction atomique : créer le boost ET débiter le wallet
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1. Créer le boost
      const boost = await prisma.boost.create({
        data: {
          listingId,
          boostProductId,
          buyerId: userId,
          startsAt,
          endsAt,
          paymentStatus: 'COMPLETED',
          paymentAmount: BigInt(0), // Pas de paiement FCFA
          paymentProvider: 'credits',
        },
        include: {
          boostProduct: true,
          listing: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // 2. Débiter le wallet
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceCredits: {
            decrement: boostProduct.creditsCost,
          },
        },
      });

      // 3. Créer la transaction wallet
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEBIT',
          amount: boostProduct.creditsCost,
          reason: `Achat pack boost: ${boostProduct.name}`,
          relatedEntityType: 'BOOST',
          relatedEntityId: boost.id,
          actorId: userId,
        },
      });

      // 4. Mettre à jour l'annonce
      await prisma.listing.update({
        where: { id: listingId },
        data: {
          isSponsored: true,
          sponsoredUntil: endsAt,
          sponsoredPriority: boostProduct.priority,
        },
      });

      return boost;
    });

    // Log d'audit
    await this.auditService.log({
      actorId: userId,
      action: 'BOOST_PURCHASED_WITH_CREDITS',
      targetType: 'Listing',
      targetId: listingId,
      meta: {
        boostProductId,
        creditsCost: boostProduct.creditsCost.toString(),
        durationDays: boostProduct.durationDays,
      },
      ip,
    });

    return {
      ...result,
      paymentAmount: result.paymentAmount.toString(),
      boostProduct: {
        ...result.boostProduct,
        priceFcfa: result.boostProduct.priceFcfa.toString(),
        creditsCost: result.boostProduct.creditsCost.toString(),
      },
    };
  }

  async getMyBoosts(userId: string) {
    const boosts = await this.prisma.boost.findMany({
      where: {
        listing: {
          userId,
        },
      },
      include: {
        boostProduct: true,
        listing: {
          select: {
            id: true,
            title: true,
            images: {
              take: 1,
              orderBy: { sort: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return boosts.map((boost) => ({
      ...boost,
      paymentAmount: boost.paymentAmount.toString(),
      boostProduct: {
        ...boost.boostProduct,
        priceFcfa: boost.boostProduct.priceFcfa.toString(),
        creditsCost: boost.boostProduct.creditsCost.toString(),
      },
    }));
  }

  // Tâche planifiée : désactiver les boosts expirés
  @Cron('0 * * * *') // Toutes les heures
  async deactivateExpiredBoosts() {
    const now = new Date();

    const expiredListings = await this.prisma.listing.findMany({
      where: {
        isSponsored: true,
        sponsoredUntil: {
          lte: now,
        },
      },
    });

    if (expiredListings.length > 0) {
      await this.prisma.listing.updateMany({
        where: {
          id: {
            in: expiredListings.map((l) => l.id),
          },
        },
        data: {
          isSponsored: false,
          sponsoredPriority: 0,
        },
      });

      console.log(`✅ ${expiredListings.length} boosts expirés désactivés`);
    }
  }
}

