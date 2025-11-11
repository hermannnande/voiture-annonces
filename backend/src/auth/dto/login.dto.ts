import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  password: string;
}





