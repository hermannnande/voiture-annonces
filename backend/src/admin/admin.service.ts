import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ListingStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  // ============ MODÉRATION ============

  async getPendingListings(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where: { status: ListingStatus.EN_ATTENTE },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          brand: true,
          model: true,
          category: true,
          images: {
            orderBy: { sort: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.listing.count({
        where: { status: ListingStatus.EN_ATTENTE },
      }),
    ]);

    return {
      listings: listings.map((l) => ({ ...l, priceFcfa: l.priceFcfa.toString() })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveListing(listingId: string, adminId: string, ip?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.APPROUVEE,
        rejectionReason: null,
      },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: adminId,
    //   action: 'LISTING_APPROVED',
    //   targetType: 'Listing',
    //   targetId: listingId,
    //   meta: { title: listing.title },
    //   ip,
    // });

    return { ...updated, priceFcfa: updated.priceFcfa.toString() };
  }

  async rejectListing(listingId: string, adminId: string, reason: string, ip?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.REFUSEE,
        rejectionReason: reason,
      },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: adminId,
    //   action: 'LISTING_REJECTED',
    //   targetType: 'Listing',
    //   targetId: listingId,
    //   meta: { title: listing.title, reason },
    //   ip,
    // });

    return { ...updated, priceFcfa: updated.priceFcfa.toString() };
  }

  async bulkApproveListing(listingIds: string[], adminId: string, ip?: string) {
    await this.prisma.listing.updateMany({
      where: { id: { in: listingIds } },
      data: {
        status: ListingStatus.APPROUVEE,
        rejectionReason: null,
      },
    });

    // Log d'audit (désactivé temporairement)
    // for (const listingId of listingIds) {
    //   await this.auditService.log({
    //     actorId: adminId,
    //     action: 'LISTING_APPROVED',
    //     targetType: 'Listing',
    //     targetId: listingId,
    //     meta: { bulk: true },
    //     ip,
    //   });
    // }

    return { message: `${listingIds.length} annonces approuvées` };
  }

  // ============ GESTION DES UTILISATEURS ============

  async getAllUsers(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              listings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    // Ajouter le statut ACTIF/INACTIF basé sur isActive
    const usersWithStatus = users.map(user => ({
      ...user,
      status: user.isActive ? 'ACTIF' : 'INACTIF',
    }));

    return usersWithStatus;
  }

  async toggleUserActive(userId: string, adminId: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: adminId,
    //   action: updated.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
    //   targetType: 'User',
    //   targetId: userId,
    //   meta: { userEmail: user.email },
    //   ip,
    // });

    return updated;
  }

  async updateUserStatus(userId: string, status: string, adminId: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isActive = status === 'ACTIF';
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: adminId,
    //   action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
    //   targetType: 'User',
    //   targetId: userId,
    //   meta: { userEmail: user.email, newStatus: status },
    //   ip,
    // });

    return { ...updated, status: isActive ? 'ACTIF' : 'INACTIF' };
  }

  async resetUserPassword(userId: string, adminId: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Générer un nouveau mot de passe aléatoire
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: adminId,
    //   action: 'USER_PASSWORD_RESET',
    //   targetType: 'User',
    //   targetId: userId,
    //   meta: { userEmail: user.email },
    //   ip,
    // });

    return {
      message: 'Mot de passe réinitialisé avec succès',
      newPassword,
      email: user.email,
    };
  }

  // ============ GESTION DES PRODUITS DE BOOST ============

  async getAllBoostProducts() {
    return this.prisma.boostProduct.findMany({
      orderBy: { priceFcfa: 'asc' },
    });
  }

  async createBoostProduct(data: {
    name: string;
    description?: string;
    durationDays: number;
    priority: number;
    priceFcfa: number;
    features?: any;
  }) {
    return this.prisma.boostProduct.create({
      data: {
        ...data,
        priceFcfa: BigInt(data.priceFcfa),
      },
    });
  }

  async updateBoostProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      durationDays?: number;
      priority?: number;
      priceFcfa?: number;
      isActive?: boolean;
      features?: any;
    },
  ) {
    return this.prisma.boostProduct.update({
      where: { id },
      data: {
        ...data,
        priceFcfa: data.priceFcfa ? BigInt(data.priceFcfa) : undefined,
      },
    });
  }

  async deleteBoostProduct(id: number) {
    return this.prisma.boostProduct.delete({
      where: { id },
    });
  }

  // ============ STATISTIQUES ============

  async getStats(startDate?: Date, endDate?: Date) {
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = startDate;
      if (endDate) dateFilter.createdAt.lte = endDate;
    }

    const [
      totalListings,
      pendingListings,
      approvedListings,
      rejectedListings,
      soldListings,
      totalUsers,
      totalBoosts,
      totalRevenue,
      avgApprovalTime,
    ] = await Promise.all([
      this.prisma.listing.count({ where: dateFilter }),
      this.prisma.listing.count({ where: { ...dateFilter, status: ListingStatus.EN_ATTENTE } }),
      this.prisma.listing.count({ where: { ...dateFilter, status: ListingStatus.APPROUVEE } }),
      this.prisma.listing.count({ where: { ...dateFilter, status: ListingStatus.REFUSEE } }),
      this.prisma.listing.count({ where: { ...dateFilter, status: ListingStatus.VENDU } }),
      this.prisma.user.count({ where: dateFilter }),
      this.prisma.boost.count({ where: dateFilter }),
      this.prisma.boost.aggregate({
        where: dateFilter,
        _sum: { paymentAmount: true },
      }),
      this.getAverageApprovalTime(startDate, endDate),
    ]);

    // Statistiques par catégorie
    const categoriesStats = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { listings: true },
        },
      },
      orderBy: {
        listings: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Statistiques par marque
    const brandsStats = await this.prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { listings: true },
        },
      },
      orderBy: {
        listings: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return {
      listings: {
        total: totalListings,
        pending: pendingListings,
        approved: approvedListings,
        rejected: rejectedListings,
        sold: soldListings,
      },
      users: {
        total: totalUsers,
      },
      boosts: {
        total: totalBoosts,
        revenue: totalRevenue._sum.paymentAmount?.toString() || '0',
      },
      avgApprovalTime: avgApprovalTime || 0,
      topCategories: categoriesStats,
      topBrands: brandsStats,
    };
  }

  private async getAverageApprovalTime(startDate?: Date, endDate?: Date) {
    // Calcul du temps moyen entre création et approbation
    const approvedListings = await this.prisma.listing.findMany({
      where: {
        status: ListingStatus.APPROUVEE,
        createdAt: startDate ? { gte: startDate } : undefined,
        updatedAt: endDate ? { lte: endDate } : undefined,
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (approvedListings.length === 0) return 0;

    const totalMinutes = approvedListings.reduce((sum, listing) => {
      const diff = listing.updatedAt.getTime() - listing.createdAt.getTime();
      return sum + diff / (1000 * 60); // Convertir en minutes
    }, 0);

    return Math.round(totalMinutes / approvedListings.length);
  }

  // ============ SIGNALEMENTS ============

  async getReports(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async handleReport(reportId: string, adminId: string, action: 'APPROVE' | 'REJECT', adminNote?: string, ip?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { listing: true },
    });

    if (!report) {
      throw new NotFoundException('Signalement introuvable');
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        adminNote,
      },
    });

    // Si approuvé, on peut supprimer ou refuser l'annonce
    if (action === 'APPROVE') {
      await this.prisma.listing.update({
        where: { id: report.listingId },
        data: { status: ListingStatus.REFUSEE, rejectionReason: `Signalement: ${report.reason}` },
      });
    }

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: adminId,
    //   action: `REPORT_${action}`,
    //   targetType: 'Report',
    //   targetId: reportId,
    //   meta: { listingId: report.listingId, reason: report.reason },
    //   ip,
    // });

    return updated;
  }

  // ============ LOGS D'AUDIT ============

  async getAuditLogs(filters?: {
    actorId?: string;
    action?: string;
    targetType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    return this.auditService.getLogs(filters);
  }
}

