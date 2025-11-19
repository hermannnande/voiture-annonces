import { Module } from '@nestjs/common';
import { BoostsService } from './boosts.service';
import { BoostsController } from './boosts.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [BoostsService],
  controllers: [BoostsController],
  exports: [BoostsService],
})
export class BoostsModule {}





