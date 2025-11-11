import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createThread(buyerId: string, listingId: string, firstMessage: string) {
    // Récupérer l'annonce pour obtenir le vendeur
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!listing) {
      throw new NotFoundException('Annonce introuvable');
    }

    // Vérifier si un fil de discussion existe déjà
    const existingThread = await this.prisma.thread.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId,
        },
      },
    });

    if (existingThread) {
      // Ajouter le message au fil existant
      return this.sendMessage(existingThread.id, buyerId, firstMessage);
    }

    // Créer un nouveau fil de discussion avec le premier message
    const thread = await this.prisma.thread.create({
      data: {
        listingId,
        buyerId,
        sellerId: listing.userId,
        messages: {
          create: {
            senderId: buyerId,
            body: firstMessage,
          },
        },
      },
      include: {
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
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return thread;
  }

  async sendMessage(threadId: string, senderId: string, body: string) {
    // Vérifier que l'utilisateur fait partie du fil
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Conversation introuvable');
    }

    if (thread.buyerId !== senderId && thread.sellerId !== senderId) {
      throw new ForbiddenException('Vous ne faites pas partie de cette conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        threadId,
        senderId,
        body,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Mettre à jour le timestamp du fil
    await this.prisma.thread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getThreads(userId: string, userRole: UserRole) {
    // Si Super Admin, retourner tous les fils
    const where: any = userRole === UserRole.SUPER_ADMIN
      ? {}
      : {
          OR: [
            { buyerId: userId },
            { sellerId: userId },
          ],
        };

    const threads = await this.prisma.thread.findMany({
      where,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            priceFcfa: true,
            images: {
              take: 1,
              orderBy: { sort: 'asc' },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return threads.map((thread) => ({
      ...thread,
      listing: {
        ...thread.listing,
        priceFcfa: thread.listing.priceFcfa?.toString(),
      },
    }));
  }

  async getThreadById(threadId: string, userId: string, userRole: UserRole) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            priceFcfa: true,
            images: {
              take: 1,
              orderBy: { sort: 'asc' },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!thread) {
      throw new NotFoundException('Conversation introuvable');
    }

    // Vérifier les droits d'accès
    if (
      userRole !== UserRole.SUPER_ADMIN &&
      thread.buyerId !== userId &&
      thread.sellerId !== userId
    ) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette conversation');
    }

    // Marquer les messages comme lus
    await this.prisma.message.updateMany({
      where: {
        threadId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return {
      ...thread,
      listing: {
        ...thread.listing,
        priceFcfa: thread.listing.priceFcfa?.toString(),
      },
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        thread: {
          OR: [
            { buyerId: userId },
            { sellerId: userId },
          ],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return { count };
  }
}





