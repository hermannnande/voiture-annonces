import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { InitializePaymentDto } from './dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  /**
   * Initialiser un paiement pour acheter des crédits
   * POST /api/payments/initialize-credits
   */
  @Post('initialize-credits')
  async initializePayment(
    @CurrentUser('id') userId: string,
    @Body() dto: InitializePaymentDto,
  ) {
    return this.paymentsService.initializePayment(userId, dto);
  }

  /**
   * Initialiser un paiement pour boost d'annonce
   * POST /api/payments/initialize-boost
   */
  @Post('initialize-boost')
  async initializeBoostPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.paymentsService.initializeBoostPayment(userId, dto);
  }

  /**
   * Callback de retour après paiement Payfonte (crédits)
   * GET /api/payments/payfonte/callback
   * Payfonte redirige ici avec: ?reference=xxx&status=xxx
   */
  @Get('payfonte/callback')
  @Public() // Public car appelé par redirection Payfonte
  async payfonteCallback(
    @Query('reference') reference: string,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    console.log('🔄 Controller callback Payfonte - Paramètres:', { reference, status });
    
    const result = await this.paymentsService.handleCallback(reference, status);
    
    console.log('➡️  Redirection vers:', result.redirect);
    
    // Rediriger vers le frontend avec le résultat (SANS return)
    res.redirect(result.redirect);
  }

  /**
   * Callback de retour après paiement Payfonte (boost)
   * GET /api/payments/payfonte/callback-boost
   * Payfonte redirige ici avec: ?reference=xxx&status=xxx
   */
  @Get('payfonte/callback-boost')
  @Public()
  async payfonteCallbackBoost(
    @Query('reference') reference: string,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    console.log('🔄 Controller callback Payfonte (BOOST) - Paramètres:', { reference, status });
    
    const result = await this.paymentsService.handleCallbackBoost(reference, status);
    
    console.log('➡️  Redirection vers:', result.redirect);
    
    res.redirect(result.redirect);
  }

  /**
   * Vérifier un paiement Moneroo
   * GET /api/payments/verify/:transactionId
   */
  @Get('verify/:transactionId')
  async verifyPayment(@Param('transactionId') transactionId: string) {
    return this.paymentsService.verifyPayment(transactionId);
  }

  /**
   * Obtenir l'historique des achats de crédits
   * GET /api/payments/my-purchases
   */
  @Get('my-purchases')
  async getMyPurchases(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getPurchaseHistory(
      userId,
      parseInt(page || '1'),
      parseInt(limit || '20'),
    );
  }

  /**
   * Vérifier et compléter un paiement manuellement
   * POST /api/payments/check-and-complete/:purchaseId
   */
  @Post('check-and-complete/:purchaseId')
  async checkAndComplete(@Param('purchaseId') purchaseId: string) {
    return this.paymentsService.checkAndCompletePayment(purchaseId);
  }

  /**
   * 🔄 RÉCONCILIATION AUTOMATIQUE
   * Vérifie tous les paiements PENDING et les crédite automatiquement si payés
   * POST /api/payments/reconcile-pending
   * À appeler via un cron job toutes les 5-10 minutes
   */
  @Post('reconcile-pending')
  @Public() // Public pour permettre l'appel par un cron externe
  async reconcilePendingPayments() {
    return this.paymentsService.reconcilePendingPayments();
  }

  /**
   * Webhook de Payfonte (appelé automatiquement après paiement)
   * POST /api/payments/webhook/payfonte
   * IMPORTANT: Cette URL est automatiquement appelée par Payfonte lors de la création du checkout
   * URL: https://api.annonceauto.ci/api/payments/webhook/payfonte
   */
  @Post('webhook/payfonte')
  @Public() // Public car appelé par Payfonte
  async handlePayfonteWebhook(@Req() req: any, @Body() webhookData: any) {
    console.log('📥 Webhook Payfonte reçu:', JSON.stringify(webhookData, null, 2));
    
    return this.paymentsService.handleWebhook(webhookData);
  }
}

