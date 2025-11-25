import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  @Public()
  async findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string) {
    return this.brandsService.findById(parseInt(id));
  }

  @Get(':id/models')
  @Public()
  async getModels(@Param('id') id: string) {
    return this.brandsService.getModelsByBrand(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() data: { name: string; slug: string }) {
    return this.brandsService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() data: { name?: string; slug?: string }) {
    return this.brandsService.update(parseInt(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async delete(@Param('id') id: string) {
    return this.brandsService.delete(parseInt(id));
  }

  @Post(':id/models')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async createModel(@Param('id') id: string, @Body() data: { name: string; slug: string }) {
    return this.brandsService.createModel(parseInt(id), data);
  }
}





