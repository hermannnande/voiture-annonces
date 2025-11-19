import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateThreadDto {
  @IsString({ message: 'L\'ID de l\'annonce doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'L\'ID de l\'annonce est obligatoire' })
  listingId: string;

  @IsString({ message: 'Le message doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le message est obligatoire' })
  @MinLength(5, { message: 'Le message doit contenir au moins 5 caractères' })
  message: string;
}





