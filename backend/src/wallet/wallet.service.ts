import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { WalletTransactionType } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  /**
   * Obtenir ou créer le wallet d'un utilisateur
   */
  async getOrCreateWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    return {
      ...wallet,
      balanceCredits: wallet.balanceCredits.toString(),
    };
  }

  /**
   * Obtenir l'historique des transactions d'un wallet
   */
  async getWalletTransactions(
    userId: string,
    page = 1,
    limit = 20,
  ) {
    const wallet = await this.getOrCreateWallet(userId);

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.walletTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return {
      transactions: transactions.map((t) => ({
        ...t,
        amount: t.amount.toString(),
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
   * Créditer un wallet (Super Admin uniquement)
   */
  async creditWallet(
    userId: string,
    amount: bigint,
    reason: string,
    actorId: string,
    ip?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Le montant doit être positif');
    }

    const wallet = await this.getOrCreateWallet(userId);

    // Transaction atomique
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1. Mettre à jour le solde
      const updatedWallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceCredits: {
            increment: amount,
          },
        },
      });

      // 2. Créer la transaction
      const transaction = await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.CREDIT,
          amount,
          reason,
          relatedEntityType: 'ADMIN_OP',
          actorId,
        },
      });

      return { updatedWallet, transaction };
    });

    // 3. Log d'audit
    await this.auditService.log({
      actorId,
      action: 'WALLET_CREDITED',
      targetType: 'Wallet',
      targetId: wallet.id,
      meta: {
        userId,
        amount: amount.toString(),
        reason,
      },
      ip,
    });

    return {
      wallet: {
        ...result.updatedWallet,
        balanceCredits: result.updatedWallet.balanceCredits.toString(),
      },
      transaction: {
        ...result.transaction,
        amount: result.transaction.amount.toString(),
      },
    };
  }

  /**
   * Débiter un wallet (Super Admin uniquement pour correction)
   */
  async debitWallet(
    userId: string,
    amount: bigint,
    reason: string,
    actorId: string,
    ip?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Le montant doit être positif');
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (BigInt(wallet.balanceCredits) < amount) {
      throw new BadRequestException('Solde insuffisant');
    }

    // Transaction atomique
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1. Mettre à jour le solde
      const updatedWallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceCredits: {
            decrement: amount,
          },
        },
      });

      // 2. Créer la transaction
      const transaction = await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.DEBIT,
          amount,
          reason,
          relatedEntityType: 'ADMIN_OP',
          actorId,
        },
      });

      return { updatedWallet, transaction };
    });

    // 3. Log d'audit
    await this.auditService.log({
      actorId,
      action: 'WALLET_DEBITED',
      targetType: 'Wallet',
      targetId: wallet.id,
      meta: {
        userId,
        amount: amount.toString(),
        reason,
      },
      ip,
    });

    return {
      wallet: {
        ...result.updatedWallet,
        balanceCredits: result.updatedWallet.balanceCredits.toString(),
      },
      transaction: {
        ...result.transaction,
        amount: result.transaction.amount.toString(),
      },
    };
  }

  /**
   * Débiter des crédits pour un achat de pack (vendeur)
   */
  async debitForBoost(
    userId: string,
    amount: bigint,
    boostProductId: number,
    boostId: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Le montant doit être positif');
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (BigInt(wallet.balanceCredits) < amount) {
      throw new BadRequestException('Solde insuffisant');
    }

    // Transaction atomique
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1. Mettre à jour le solde
      const updatedWallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceCredits: {
            decrement: amount,
          },
        },
      });

      // 2. Créer la transaction
      const transaction = await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.DEBIT,
          amount,
          reason: `Achat pack boost (produit #${boostProductId})`,
          relatedEntityType: 'BOOST',
          relatedEntityId: boostId,
          actorId: userId,
        },
      });

      return { updatedWallet, transaction };
    });

    return {
      wallet: {
        ...result.updatedWallet,
        balanceCredits: result.updatedWallet.balanceCredits.toString(),
      },
      transaction: {
        ...result.transaction,
        amount: result.transaction.amount.toString(),
      },
    };
  }

  /**
   * Obtenir tous les wallets (Admin)
   */
  async getAllWallets(page = 1, limit = 50, searchQuery?: string) {
    const skip = (page - 1) * limit;

    const where = searchQuery
      ? {
          OR: [
            { user: { name: { contains: searchQuery, mode: 'insensitive' as any } } },
            { user: { email: { contains: searchQuery, mode: 'insensitive' as any } } },
          ],
        }
      : {};

    const [wallets, total] = await Promise.all([
      this.prisma.wallet.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              isActive: true,
            },
          },
          _count: {
            select: {
              transactions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wallet.count({ where }),
    ]);

    return {
      wallets: wallets.map((w) => ({
        ...w,
        balanceCredits: w.balanceCredits.toString(),
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
   * Obtenir un wallet spécifique avec son historique (Admin)
   */
  async getWalletByUserId(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        transactions: {
          include: {
            actor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet introuvable');
    }

    return {
      ...wallet,
      balanceCredits: wallet.balanceCredits.toString(),
      transactions: wallet.transactions.map((t) => ({
        ...t,
        amount: t.amount.toString(),
      })),
    };
  }
}

