import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseBoostDto {
  @IsString({ message: 'L\'ID de l\'annonce doit être une chaîne de caractères' })
  listingId: string;

  @IsNumber({}, { message: 'L\'ID du produit de boost doit être un nombre' })
  @Type(() => Number)
  boostProductId: number;

  @IsOptional()
  @IsString({ message: 'Le fournisseur de paiement doit être une chaîne de caractères' })
  paymentProvider?: string;
}





