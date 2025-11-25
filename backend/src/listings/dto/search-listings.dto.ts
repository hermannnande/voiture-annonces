import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingState, FuelType, GearboxType, ListingStatus } from '@prisma/client';

export class SearchListingsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @IsOptional()
  @IsEnum(ListingState)
  state?: ListingState;

  @IsOptional()
  @IsEnum(FuelType)
  fuel?: FuelType;

  @IsOptional()
  @IsEnum(GearboxType)
  gearbox?: GearboxType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  brandId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsString()
  locationCity?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceMax?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearMax?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  mileageMax?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}





