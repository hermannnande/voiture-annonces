import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
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
   * Vérifier un paiement Moneroo
   * GET /api/payments/verify/:monerooPaymentId
   */
  @Get('verify/:monerooPaymentId')
  async verifyPayment(@Param('monerooPaymentId') monerooPaymentId: string) {
    return this.paymentsService.verifyPayment(monerooPaymentId);
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
   */
  @Post('webhook/moneroo')
  @Public() // Public car appelé par Moneroo
  async handleMonerooWebhook(@Req() req: any, @Body() webhookData: any) {
    console.log('📥 Webhook Moneroo reçu:', JSON.stringify(webhookData, null, 2));

    // TODO: Ajouter vérification de signature Moneroo pour sécurité
    
    return this.paymentsService.handleWebhook(webhookData);
  }
}

