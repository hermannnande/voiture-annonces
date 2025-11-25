import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString({ message: 'Le message doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le message est obligatoire' })
  @MinLength(1, { message: 'Le message ne peut pas être vide' })
  body: string;
}





