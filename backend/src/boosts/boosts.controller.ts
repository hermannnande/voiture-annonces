import { Controller, Get, Post, Body, Param, UseGuards, Ip } from '@nestjs/common';
import { BoostsService } from './boosts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PurchaseBoostDto } from './dto/purchase-boost.dto';

@Controller('boosts')
export class BoostsController {
  constructor(private boostsService: BoostsService) {}

  @Get('products')
  @Public()
  async getBoostProducts() {
    return this.boostsService.getBoostProducts();
  }

  @Get('products/:id')
  @Public()
  async getBoostProductById(@Param('id') id: string) {
    return this.boostsService.getBoostProductById(parseInt(id));
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  async purchaseBoost(
    @CurrentUser('id') userId: string,
    @Body() dto: PurchaseBoostDto,
    @Ip() ip: string,
  ) {
    return this.boostsService.purchaseBoost(
      userId,
      dto.listingId,
      dto.boostProductId,
      dto.paymentProvider || 'mock',
      ip,
    );
  }

  @Post('purchase-with-credits')
  @UseGuards(JwtAuthGuard)
  async purchaseBoostWithCredits(
    @CurrentUser('id') userId: string,
    @Body('listingId') listingId: string,
    @Body('boostProductId') boostProductId: number,
    @Ip() ip: string,
  ) {
    return this.boostsService.purchaseBoostWithCredits(
      userId,
      listingId,
      boostProductId,
      ip,
    );
  }

  @Get('my-boosts')
  @UseGuards(JwtAuthGuard)
  async getMyBoosts(@CurrentUser('id') userId: string) {
    return this.boostsService.getMyBoosts(userId);
  }
}

