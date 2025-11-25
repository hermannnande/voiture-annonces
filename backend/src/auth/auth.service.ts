import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto, ip?: string) {
    // Vérifier si l'email existe déjà
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Générer un token de vérification
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24); // Expire dans 24h

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role || 'SELLER',
        isEmailVerified: false,
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Envoyer l'email de vérification
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        emailVerificationToken,
      );
    } catch (error) {
      console.error('Erreur envoi email de vérification:', error);
      // On ne bloque pas l'inscription si l'email échoue
    }

    // Générer les tokens JWT
    return {
      ...await this.generateTokens(user),
      message: 'Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    // Marquer l'email comme vérifié
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return {
      message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.',
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Cet email est déjà vérifié');
    }

    // Générer un nouveau token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Envoyer l'email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      emailVerificationToken,
    );

    return {
      message: 'Un nouvel email de vérification a été envoyé',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return {
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      };
    }

    // Générer un token de réinitialisation
    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date();
    passwordResetExpires.setHours(passwordResetExpires.getHours() + 1); // Expire dans 1h

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Envoyer l'email de réinitialisation
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        passwordResetToken,
      );
    } catch (error) {
      console.error('Erreur envoi email de réinitialisation:', error);
    }

    return {
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Envoyer un email de confirmation (optionnel)
    // Note: Vous pouvez ajouter cette méthode dans EmailService si nécessaire
    
    return {
      message: 'Mot de passe réinitialisé avec succès',
    };
  }

  async login(dto: LoginDto, ip?: string) {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Votre compte est désactivé');
    }

    // Avertir si l'email n'est pas vérifié (mais permettre la connexion)
    const warning = !user.isEmailVerified 
      ? 'Attention : Votre email n\'est pas encore vérifié. Vérifiez votre boîte de réception.' 
      : undefined;

    return {
      ...await this.generateTokens(user),
      warning,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });

    // Stocker le refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Supprimer le hash du mot de passe avant de renvoyer l'utilisateur
    delete user.passwordHash;

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Vérifier que le token existe en DB
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Token invalide ou expiré');
      }

      // Supprimer l'ancien token
      await this.prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      // Générer de nouveaux tokens
      return this.generateTokens(tokenRecord.user);
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  async logout(refreshToken: string) {
    // Supprimer le refresh token
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Déconnexion réussie' };
  }

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
    photo?: string;
  }) {
    // Vérifier si un utilisateur existe déjà avec cet email
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (user) {
      // Mettre à jour le googleId si ce n'est pas déjà fait
      if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: profile.googleId,
            isEmailVerified: true, // Google a déjà vérifié l'email
          },
        });
      }
    } else {
      // Créer un nouvel utilisateur
      user = await this.prisma.user.create({
        data: {
          googleId: profile.googleId,
          email: profile.email,
          name: profile.name,
          isEmailVerified: true, // Google a déjà vérifié l'email
          passwordHash: null, // Pas de mot de passe pour OAuth
          role: 'SELLER',
        },
      });
    }

    return user;
  }

  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    return this.generateTokens(user);
  }
}
