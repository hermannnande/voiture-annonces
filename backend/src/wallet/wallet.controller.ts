import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  // ============ ENDPOINTS VENDEUR ============

  @Get('me')
  async getMyWallet(@CurrentUser('id') userId: string) {
    return this.walletService.getOrCreateWallet(userId);
  }

  @Get('me/transactions')
  async getMyTransactions(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletService.getWalletTransactions(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  // ============ ENDPOINTS ADMIN ============

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getAllWallets(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('query') query?: string,
  ) {
    return this.walletService.getAllWallets(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
      query,
    );
  }

  @Get('admin/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getWalletByUserId(@Param('userId') userId: string) {
    return this.walletService.getWalletByUserId(userId);
  }

  @Post('admin/:userId/credit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async creditWallet(
    @Param('userId') userId: string,
    @CurrentUser('id') adminId: string,
    @Body('amount') amount: string,
    @Body('reason') reason: string,
    @Ip() ip: string,
  ) {
    if (!amount || !reason) {
      throw new Error('Montant et raison requis');
    }

    return this.walletService.creditWallet(
      userId,
      BigInt(amount),
      reason,
      adminId,
      ip,
    );
  }

  @Post('admin/:userId/debit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async debitWallet(
    @Param('userId') userId: string,
    @CurrentUser('id') adminId: string,
    @Body('amount') amount: string,
    @Body('reason') reason: string,
    @Ip() ip: string,
  ) {
    if (!amount || !reason) {
      throw new Error('Montant et raison requis');
    }

    return this.walletService.debitWallet(
      userId,
      BigInt(amount),
      reason,
      adminId,
      ip,
    );
  }
}

