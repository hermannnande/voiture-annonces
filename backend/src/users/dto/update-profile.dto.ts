import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne de caractères' })
  phone?: string;
}





