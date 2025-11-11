import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async getTree() {
    // Récupérer toutes les catégories racines (sans parent)
    const rootCategories = await this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: {
              select: { listings: true },
            },
          },
        },
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return rootCategories;
  }

  async create(data: { name: string; slug: string; parentId?: number }) {
    return this.prisma.category.create({ data });
  }

  async update(id: number, data: { name?: string; slug?: string; parentId?: number }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}





