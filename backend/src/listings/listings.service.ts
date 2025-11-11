import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ListingStatus, UserRole } from '@prisma/client';
import { CreateListingDto, UpdateListingDto, SearchListingsDto } from './dto';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(userId: string, dto: CreateListingDto, ip?: string) {
    // Créer l'annonce
    const listing = await this.prisma.listing.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        priceFcfa: BigInt(dto.priceFcfa),
        state: dto.state,
        fuel: dto.fuel,
        gearbox: dto.gearbox,
        year: dto.year,
        mileageKm: dto.mileageKm,
        color: dto.color,
        doors: dto.doors,
        powerCv: dto.powerCv,
        chassisNumber: dto.chassisNumber,
        brandId: dto.brandId,
        modelId: dto.modelId,
        categoryId: dto.categoryId,
        locationCountry: dto.locationCountry || 'Côte d\'Ivoire',
        locationCity: dto.locationCity,
        status: dto.status || ListingStatus.EN_ATTENTE,
        images: {
          create: dto.images?.map((url, index) => ({
            url,
            sort: index,
          })) || [],
        },
      },
      include: {
        brand: true,
        model: true,
        category: true,
        images: {
          orderBy: { sort: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: userId,
    //   action: 'LISTING_CREATED',
    //   targetType: 'Listing',
    //   targetId: listing.id,
    //   meta: { title: listing.title, status: listing.status },
    //   ip,
    // });

    return this.formatListing(listing);
  }

  async update(listingId: string, userId: string, userRole: UserRole, dto: UpdateListingDto, ip?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    // Vérifier les droits
    if (listing.userId !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Vous n\'avez pas les droits pour modifier cette annonce');
    }

    // Si modification majeure par un vendeur, repasser en attente
    let newStatus = listing.status;
    if (listing.userId === userId && userRole !== UserRole.SUPER_ADMIN) {
      const hasMajorChanges = dto.title || dto.description || dto.priceFcfa || dto.images;
      if (hasMajorChanges && listing.status === ListingStatus.APPROUVEE) {
        newStatus = ListingStatus.EN_ATTENTE;
      }
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        ...dto,
        priceFcfa: dto.priceFcfa ? BigInt(dto.priceFcfa) : undefined,
        status: newStatus,
        images: dto.images ? {
          deleteMany: {},
          create: dto.images.map((url, index) => ({
            url,
            sort: index,
          })),
        } : undefined,
      },
      include: {
        brand: true,
        model: true,
        category: true,
        images: {
          orderBy: { sort: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: userId,
    //   action: 'LISTING_UPDATED',
    //   targetType: 'Listing',
    //   targetId: listingId,
    //   meta: { changes: dto, newStatus },
    //   ip,
    // });

    return this.formatListing(updated);
  }

  async findById(listingId: string, incrementView = false) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        brand: true,
        model: true,
        category: true,
        images: {
          orderBy: { sort: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        boosts: {
          where: {
            endsAt: { gte: new Date() },
          },
          include: {
            boostProduct: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    // Incrémenter le compteur de vues
    if (incrementView) {
      await this.prisma.listing.update({
        where: { id: listingId },
        data: { viewCount: { increment: 1 } },
      });
    }

    return this.formatListing(listing);
  }

  async search(dto: SearchListingsDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      query,
      status,
      state,
      fuel,
      gearbox,
      brandId,
      categoryId,
      locationCity,
      priceMin,
      priceMax,
      yearMin,
      yearMax,
      mileageMax,
      color,
      userId,
    } = dto;

    const skip = (page - 1) * limit;

    // Construction des filtres
    const where: any = {};

    // Statut par défaut : seulement les annonces approuvées pour le public
    if (status) {
      where.status = status;
    } else if (!userId) {
      where.status = ListingStatus.APPROUVEE;
    }

    // Filtres de recherche
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (state) where.state = state;
    if (fuel) where.fuel = fuel;
    if (gearbox) where.gearbox = gearbox;
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (locationCity) where.locationCity = { contains: locationCity, mode: 'insensitive' };
    if (color) where.color = { contains: color, mode: 'insensitive' };
    if (userId) where.userId = userId;

    // Filtres de prix
    if (priceMin || priceMax) {
      where.priceFcfa = {};
      if (priceMin) where.priceFcfa.gte = BigInt(priceMin);
      if (priceMax) where.priceFcfa.lte = BigInt(priceMax);
    }

    // Filtres d'année
    if (yearMin || yearMax) {
      where.year = {};
      if (yearMin) where.year.gte = yearMin;
      if (yearMax) where.year.lte = yearMax;
    }

    // Filtre de kilométrage
    if (mileageMax) {
      where.mileageKm = { lte: mileageMax };
    }

    // Ordre de tri
    const orderBy: any = [];

    // Les annonces sponsorisées en premier
    orderBy.push({ isSponsored: 'desc' });
    orderBy.push({ sponsoredPriority: 'desc' });

    // Puis tri selon le paramètre
    if (sortBy === 'price') {
      orderBy.push({ priceFcfa: sortOrder });
    } else if (sortBy === 'mileage') {
      orderBy.push({ mileageKm: sortOrder });
    } else if (sortBy === 'year') {
      orderBy.push({ year: sortOrder });
    } else {
      orderBy.push({ createdAt: sortOrder });
    }

    // Date actuelle pour filtrer les boosts actifs
    const now = new Date();

    // Requête
    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        include: {
          brand: true,
          model: true,
          category: true,
          images: {
            orderBy: { sort: 'asc' },
            take: 1,
          },
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          boosts: {
            where: {
              startsAt: { lte: now },
              endsAt: { gte: now },
            },
            include: {
              boostProduct: true,
            },
            orderBy: {
              boostProduct: {
                priority: 'desc',
              },
            },
            take: 1, // On ne prend que le boost le plus prioritaire
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.listing.count({ where }),
    ]);

    // Trier les listings pour mettre les boostés en premier
    const sortedListings = listings.sort((a, b) => {
      const aHasBoost = a.boosts && a.boosts.length > 0;
      const bHasBoost = b.boosts && b.boosts.length > 0;

      // Si les deux ont un boost, trier par priorité du boost
      if (aHasBoost && bHasBoost) {
        const aPriority = a.boosts[0].boostProduct.priority;
        const bPriority = b.boosts[0].boostProduct.priority;
        return bPriority - aPriority; // Priorité décroissante
      }

      // Si seul a a un boost, a vient en premier
      if (aHasBoost) return -1;
      
      // Si seul b a un boost, b vient en premier
      if (bHasBoost) return 1;

      // Sinon, garder l'ordre de la base de données
      return 0;
    });

    return {
      listings: sortedListings.map((listing) => this.formatListing(listing)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsSold(listingId: string, userId: string, userRole: UserRole, ip?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    if (listing.userId !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Vous n\'avez pas les droits pour marquer cette annonce comme vendue');
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: { status: ListingStatus.VENDU },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: userId,
    //   action: 'LISTING_MARKED_SOLD',
    //   targetType: 'Listing',
    //   targetId: listingId,
    //   ip,
    // });

    return updated;
  }

  async delete(listingId: string, userId: string, userRole: UserRole, ip?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    if (listing.userId !== userId && userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Vous n\'avez pas les droits pour supprimer cette annonce');
    }

    await this.prisma.listing.delete({
      where: { id: listingId },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: userId,
    //   action: 'LISTING_DELETED',
    //   targetType: 'Listing',
    //   targetId: listingId,
    //   ip,
    // });

    return { message: 'Annonce supprimée avec succès' };
  }

  async getSimilar(listingId: string, limit = 6) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return [];
    }

    // Rechercher des annonces similaires (même catégorie, marque proche, prix proche)
    const similar = await this.prisma.listing.findMany({
      where: {
        id: { not: listingId },
        status: ListingStatus.APPROUVEE,
        OR: [
          { categoryId: listing.categoryId },
          { brandId: listing.brandId },
          {
            priceFcfa: {
              gte: listing.priceFcfa - listing.priceFcfa / BigInt(3),
              lte: listing.priceFcfa + listing.priceFcfa / BigInt(3),
            },
          },
        ],
      },
      include: {
        brand: true,
        model: true,
        category: true,
        images: {
          orderBy: { sort: 'asc' },
          take: 1,
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return similar.map((l) => this.formatListing(l));
  }

  // Formater une annonce (convertir BigInt en string pour JSON)
  private formatListing(listing: any) {
    return {
      ...listing,
      priceFcfa: listing.priceFcfa?.toString(),
      boosts: listing.boosts?.map((boost: any) => ({
        ...boost,
        paymentAmount: boost.paymentAmount?.toString(),
        boostProduct: boost.boostProduct ? {
          ...boost.boostProduct,
          priceFcfa: boost.boostProduct.priceFcfa?.toString(),
          creditsCost: boost.boostProduct.creditsCost?.toString(),
        } : undefined,
      })),
    };
  }
}


