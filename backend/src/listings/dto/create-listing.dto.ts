import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ListingState, FuelType, GearboxType, ListingStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString({ message: 'Le titre doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  @MinLength(10, { message: 'Le titre doit contenir au moins 10 caractères' })
  title: string;

  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'La description est obligatoire' })
  @MinLength(50, { message: 'La description doit contenir au moins 50 caractères' })
  description: string;

  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0, { message: 'Le prix doit être positif' })
  @Type(() => Number)
  priceFcfa: number;

  @IsEnum(ListingState, { message: 'État invalide' })
  state: ListingState;

  @IsEnum(FuelType, { message: 'Type de carburant invalide' })
  fuel: FuelType;

  @IsEnum(GearboxType, { message: 'Type de boîte de vitesses invalide' })
  gearbox: GearboxType;

  @IsNumber({}, { message: 'L\'année doit être un nombre' })
  @Min(1900, { message: 'Année invalide' })
  @Max(new Date().getFullYear() + 1, { message: 'Année invalide' })
  @Type(() => Number)
  year: number;

  @IsNumber({}, { message: 'Le kilométrage doit être un nombre' })
  @Min(0, { message: 'Le kilométrage doit être positif' })
  @Type(() => Number)
  mileageKm: number;

  @IsString({ message: 'La couleur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'La couleur est obligatoire' })
  color: string;

  @IsOptional()
  @IsNumber({}, { message: 'Le nombre de portes doit être un nombre' })
  @Min(2, { message: 'Le nombre de portes doit être au moins 2' })
  @Max(6, { message: 'Le nombre de portes doit être au maximum 6' })
  @Type(() => Number)
  doors?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La puissance doit être un nombre' })
  @Min(0, { message: 'La puissance doit être positive' })
  @Type(() => Number)
  powerCv?: number;

  @IsOptional()
  @IsString({ message: 'Le numéro de châssis doit être une chaîne de caractères' })
  chassisNumber?: string;

  @IsNumber({}, { message: 'La marque est obligatoire' })
  @Type(() => Number)
  brandId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Le modèle doit être un nombre' })
  @Type(() => Number)
  modelId?: number;

  @IsNumber({}, { message: 'La catégorie est obligatoire' })
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @IsString({ message: 'Le pays doit être une chaîne de caractères' })
  locationCountry?: string;

  @IsString({ message: 'La ville est obligatoire' })
  @IsNotEmpty({ message: 'La ville est obligatoire' })
  locationCity: string;

  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Statut invalide' })
  status?: ListingStatus;

  @IsOptional()
  @IsArray({ message: 'Les images doivent être un tableau' })
  @IsString({ each: true, message: 'Chaque image doit être une URL valide' })
  images?: string[];
}





