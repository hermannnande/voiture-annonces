import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @Public()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get('tree')
  @Public()
  async getTree() {
    return this.categoriesService.getTree();
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() data: { name: string; slug: string; parentId?: number }) {
    return this.categoriesService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; slug?: string; parentId?: number },
  ) {
    return this.categoriesService.update(parseInt(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(parseInt(id));
  }
}





