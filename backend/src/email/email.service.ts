import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Configuration du transporteur email avec timeout court
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false,
      connectionTimeout: 5000, // 5 secondes max
      greetingTimeout: 5000,
      socketTimeout: 5000,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string, name: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: `"${this.configService.get('APP_NAME', 'Voiture Annonces')}" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject: '✉️ Vérifiez votre adresse email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e40af; margin-bottom: 20px;">👋 Bienvenue ${name} !</h2>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Merci de vous être inscrit sur <strong>Voiture Annonces</strong>.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                ✅ Vérifier mon email
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Ou copiez ce lien dans votre navigateur :<br>
              <a href="${verificationUrl}" style="color: #1e40af; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Ce lien est valable pendant 24 heures. Si vous n'avez pas créé ce compte, ignorez cet email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✉️ Email de vérification envoyé à: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, token: string, name: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: `"${this.configService.get('APP_NAME', 'Voiture Annonces')}" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject: '🔑 Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #dc2626; margin-bottom: 20px;">🔒 Réinitialisation du mot de passe</h2>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Bonjour ${name},
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                🔑 Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Ou copiez ce lien dans votre navigateur :<br>
              <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`🔑 Email de réinitialisation envoyé à: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  }
}
