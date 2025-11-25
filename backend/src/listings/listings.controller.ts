import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateListingDto, UpdateListingDto, SearchListingsDto } from './dto';
import { User } from '@prisma/client';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateListingDto,
    @Ip() ip: string,
  ) {
    return this.listingsService.create(user.id, dto, ip);
  }

  @Get()
  @Public()
  async search(@Query() dto: SearchListingsDto) {
    return this.listingsService.search(dto);
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string) {
    return this.listingsService.findById(id, true);
  }

  @Get(':id/similar')
  @Public()
  async getSimilar(@Param('id') id: string) {
    return this.listingsService.getSimilar(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateListingDto,
    @Ip() ip: string,
  ) {
    return this.listingsService.update(id, user.id, user.role, dto, ip);
  }

  @Post(':id/mark-sold')
  @UseGuards(JwtAuthGuard)
  async markAsSold(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Ip() ip: string,
  ) {
    return this.listingsService.markAsSold(id, user.id, user.role, ip);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Ip() ip: string,
  ) {
    return this.listingsService.delete(id, user.id, user.role, ip);
  }
}





