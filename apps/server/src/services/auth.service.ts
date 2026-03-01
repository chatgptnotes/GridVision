import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { env } from '../config/environment';
import type { LoginResponse, TokenPayload, User } from '@gridvision/shared';

export class AuthService {
  async login(username: string, password: string, ip?: string, userAgent?: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store session
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        ipAddress: ip,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: this.mapUser(user),
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await prisma.session.findFirst({
      where: { tokenHash, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!session || !session.user.isActive) {
      throw new Error('Invalid refresh token');
    }

    // Rotate refresh token
    await prisma.session.delete({ where: { id: session.id } });

    const newAccessToken = this.generateAccessToken(session.user);
    const newRefreshToken = this.generateRefreshToken(session.user);
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    await prisma.session.create({
      data: {
        userId: session.userId,
        tokenHash: newTokenHash,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  async logoutAll(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }

  private generateAccessToken(user: { id: string; username: string; role: string }): string {
    return jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY as string },
    );
  }

  private generateRefreshToken(user: { id: string; username: string; role: string }): string {
    return jwt.sign(
      { userId: user.id, username: user.username, role: user.role, type: 'refresh' },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY as string },
    );
  }

  private mapUser(user: { id: string; username: string; name: string; email: string | null; role: string; isActive: boolean; lastLogin: Date | null; createdAt: Date }): User {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email || undefined,
      role: user.role as User['role'],
      isActive: user.isActive,
      lastLogin: user.lastLogin || undefined,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
