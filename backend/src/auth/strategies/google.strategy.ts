import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get('GOOGLE_CALLBACK_URL');

    // Vérifier que les variables sont définies
    if (!clientID || !clientSecret || !callbackURL) {
      console.warn('⚠️ Google OAuth non configuré - variables manquantes');
      console.warn(`- GOOGLE_CLIENT_ID: ${clientID ? '✅' : '❌'}`);
      console.warn(`- GOOGLE_CLIENT_SECRET: ${clientSecret ? '✅' : '❌'}`);
      console.warn(`- GOOGLE_CALLBACK_URL: ${callbackURL ? '✅' : '❌'}`);
    }

    super({
      clientID: clientID || 'dummy',
      clientSecret: clientSecret || 'dummy',
      callbackURL: callbackURL || 'http://localhost:3001/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    const user = {
      googleId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      photo: photos[0].value,
    };
    
    done(null, user);
  }
}
