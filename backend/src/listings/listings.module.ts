import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { AuditModule } from '../audit/audit.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [AuditModule, UploadsModule],
  providers: [ListingsService],
  controllers: [ListingsController],
  exports: [ListingsService],
})
export class ListingsModule {}





