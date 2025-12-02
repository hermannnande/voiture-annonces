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
   * Callback de retour après paiement Moneroo
   * GET /api/payments/moneroo/callback
   * Moneroo redirige ici avec: ?monerooPaymentId=xxx&monerooPaymentStatus=xxx
   */
  @Get('moneroo/callback')
  @Public() // Public car appelé par redirection Moneroo
  async monerooCallback(
    @Query('monerooPaymentId') paymentId: string,
    @Query('monerooPaymentStatus') status: string,
    @Res() res: Response,
  ) {
    const result = await this.paymentsService.handleCallback(paymentId, status);
    
    // Rediriger vers le frontend avec le résultat
    return res.redirect(result.redirect);
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
   * Webhook de Moneroo (appelé automatiquement après paiement)
   * POST /api/payments/webhook/moneroo
   * IMPORTANT: Configurer cette URL dans le dashboard Moneroo
   * URL: https://api.annonceauto.ci/api/payments/webhook/moneroo
   */
  @Post('webhook/moneroo')
  @Public() // Public car appelé par Moneroo
  async handleMonerooWebhook(@Req() req: any, @Body() webhookData: any) {
    console.log('📥 Webhook Moneroo reçu:', JSON.stringify(webhookData, null, 2));
    
    // Récupérer la signature depuis les headers
    const signature = req.headers['x-moneroo-signature'];
    
    // Vérifier la signature pour sécurité
    const isValid = await this.paymentsService.verifyWebhookSignature(
      JSON.stringify(webhookData),
      signature,
    );
    
    if (!isValid) {
      console.error('❌ Signature webhook Moneroo invalide');
      return { success: false, message: 'Signature invalide' };
    }
    
    return this.paymentsService.handleWebhook(webhookData);
  }
}

