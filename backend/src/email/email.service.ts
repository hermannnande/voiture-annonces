import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Configuration du transporteur email
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get('EMAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Voiture Annonces" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject: '✅ Vérifiez votre adresse email',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚗 Bienvenue sur Voiture Annonces !</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${name}</strong>,</p>
                <p>Merci de vous être inscrit sur Voiture Annonces ! Pour activer votre compte et commencer à publier vos annonces, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">✅ Vérifier mon email</a>
                </div>
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #667eea;"><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p><strong>Ce lien expire dans 24 heures.</strong></p>
                <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
              </div>
              <div class="footer">
                <p>© 2024 Voiture Annonces. Tous droits réservés.</p>
                <p>Besoin d'aide ? Contactez-nous à annonceautoci@gmail.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`✅ Email de vérification envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email à ${email}:`, error.message);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Voiture Annonces" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject: '🔒 Réinitialisation de votre mot de passe',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔒 Réinitialisation de mot de passe</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${name}</strong>,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">🔐 Réinitialiser mon mot de passe</a>
                </div>
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #f5576c;"><a href="${resetUrl}">${resetUrl}</a></p>
                <div class="warning">
                  <p><strong>⚠️ Important :</strong></p>
                  <ul>
                    <li>Ce lien expire dans 1 heure</li>
                    <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                    <li>Votre mot de passe actuel reste valide jusqu'à ce que vous en créiez un nouveau</li>
                  </ul>
                </div>
              </div>
              <div class="footer">
                <p>© 2024 Voiture Annonces. Tous droits réservés.</p>
                <p>Besoin d'aide ? Contactez-nous à annonceautoci@gmail.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`✅ Email de réinitialisation envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email à ${email}:`, error.message);
      throw error;
    }
  }

  async sendPasswordChangedEmail(email: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: `"Voiture Annonces" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject: '✅ Votre mot de passe a été modifié',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Mot de passe modifié avec succès</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${name}</strong>,</p>
                <p>Votre mot de passe a été modifié avec succès.</p>
                <p>Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement à <strong>annonceautoci@gmail.com</strong></p>
                <p>Date et heure de modification : <strong>${new Date().toLocaleString('fr-FR')}</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Voiture Annonces. Tous droits réservés.</p>
                <p>📧 Contact: annonceautoci@gmail.com | 📞 +225 0778030075</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`✅ Email de confirmation envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email à ${email}:`, error.message);
      // Ne pas throw car c'est juste une notification
    }
  }
}

