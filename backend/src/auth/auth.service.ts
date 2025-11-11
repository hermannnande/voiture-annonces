import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
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

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role || 'SELLER',
      },
    });

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: user.id,
    //   action: 'USER_REGISTER',
    //   targetType: 'User',
    //   targetId: user.id,
    //   ip,
    // });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto, ip?: string) {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Votre compte est désactivé');
    }

    // Log d'audit (désactivé temporairement)
    // await this.auditService.log({
    //   actorId: user.id,
    //   action: 'USER_LOGIN',
    //   targetType: 'User',
    //   targetId: user.id,
    //   ip,
    // });

    return this.generateTokens(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
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
}





