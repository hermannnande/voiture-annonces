import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class InitializePaymentDto {
  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @Min(1, { message: 'Le montant doit être au moins 1' })
  @Type(() => Number)
  creditsAmount: number; // Nombre de crédits à acheter

  @IsOptional()
  @IsString()
  packName?: string; // Nom du pack (Starter, Standard, Premium)

  @IsOptional()
  @IsString()
  returnUrl?: string; // URL de retour après paiement
}

