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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ============ MODÉRATION ============

  @Get('moderation/pending')
  async getPendingListings(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getPendingListings(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Post('moderation/:id/approve')
  async approveListing(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Ip() ip: string,
  ) {
    return this.adminService.approveListing(id, adminId, ip);
  }

  @Post('moderation/:id/reject')
  async rejectListing(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason: string,
    @Ip() ip: string,
  ) {
    return this.adminService.rejectListing(id, adminId, reason, ip);
  }

  @Post('moderation/bulk-approve')
  async bulkApproveListing(
    @Body('listingIds') listingIds: string[],
    @CurrentUser('id') adminId: string,
    @Ip() ip: string,
  ) {
    return this.adminService.bulkApproveListing(listingIds, adminId, ip);
  }

  // ============ GESTION DES UTILISATEURS ============

  @Get('users')
  async getAllUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getAllUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Post('users/:id/toggle-active')
  async toggleUserActive(
    @Param('id') userId: string,
    @CurrentUser('id') adminId: string,
    @Ip() ip: string,
  ) {
    return this.adminService.toggleUserActive(userId, adminId, ip);
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body('status') status: string,
    @CurrentUser('id') adminId: string,
    @Ip() ip: string,
  ) {
    return this.adminService.updateUserStatus(userId, status, adminId, ip);
  }

  @Post('users/:id/reset-password')
  async resetUserPassword(
    @Param('id') userId: string,
    @CurrentUser('id') adminId: string,
    @Ip() ip: string,
  ) {
    return this.adminService.resetUserPassword(userId, adminId, ip);
  }

  // ============ GESTION DES PRODUITS DE BOOST ============

  @Get('boost-products')
  async getAllBoostProducts() {
    return this.adminService.getAllBoostProducts();
  }

  @Post('boost-products')
  async createBoostProduct(@Body() data: any) {
    return this.adminService.createBoostProduct(data);
  }

  @Patch('boost-products/:id')
  async updateBoostProduct(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateBoostProduct(parseInt(id), data);
  }

  @Delete('boost-products/:id')
  async deleteBoostProduct(@Param('id') id: string) {
    return this.adminService.deleteBoostProduct(parseInt(id));
  }

  // ============ STATISTIQUES ============

  @Get('stats')
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  // ============ SIGNALEMENTS ============

  @Get('reports')
  async getReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getReports(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status,
    );
  }

  @Post('reports/:id/handle')
  async handleReport(
    @Param('id') reportId: string,
    @CurrentUser('id') adminId: string,
    @Body('action') action: 'APPROVE' | 'REJECT',
    @Body('adminNote') adminNote: string,
    @Ip() ip: string,
  ) {
    return this.adminService.handleReport(reportId, adminId, action, adminNote, ip);
  }

  // ============ LOGS D'AUDIT ============

  @Get('audit-logs')
  async getAuditLogs(
    @Query('actorId') actorId?: string,
    @Query('action') action?: string,
    @Query('targetType') targetType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.adminService.getAuditLogs({
      actorId,
      action,
      targetType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    });
  }
}

