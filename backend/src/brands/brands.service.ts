import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const brands = await this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { listings: true },
        },
      },
    });
    
    // Mettre "Autre" à la fin de la liste
    const autreIndex = brands.findIndex(b => b.name === 'Autre');
    if (autreIndex !== -1) {
      const autre = brands.splice(autreIndex, 1)[0];
      brands.push(autre);
    }
    
    return brands;
  }

  async findById(id: number) {
    return this.prisma.brand.findUnique({
      where: { id },
      include: {
        models: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async getModelsByBrand(brandId: number) {
    return this.prisma.model.findMany({
      where: { brandId },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; slug: string }) {
    return this.prisma.brand.create({ data });
  }

  async update(id: number, data: { name?: string; slug?: string }) {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.brand.delete({
      where: { id },
    });
  }

  async createModel(brandId: number, data: { name: string; slug: string }) {
    return this.prisma.model.create({
      data: {
        ...data,
        brandId,
      },
    });
  }
}





