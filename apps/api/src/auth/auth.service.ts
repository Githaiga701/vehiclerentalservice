import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async requestOtp(phone: string): Promise<{ message: string; expiresIn: number }> {
    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = this.normalizePhone(phone);

    // Generate 6-digit OTP
    const otpCode = this.generateOTP();

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: normalizedPhone,
          role: 'RENTER', // Default role
        },
      });

      // Create trust score for new user
      await this.prisma.trustScore.create({
        data: { userId: user.id },
      });
    }

    // Create OTP record
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await this.prisma.oTP.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
      },
    });

    // In production, send OTP via SMS (Twilio, Africa's Talking, etc.)
    this.logger.log(`OTP for ${normalizedPhone}: ${otpCode}`);

    return {
      message: 'OTP sent successfully',
      expiresIn: 300, // 5 minutes in seconds
    };
  }

  async verifyOtp(phone: string, code: string): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const normalizedPhone = this.normalizePhone(phone);

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
      include: {
        kyc: true,
        trustScore: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // For development/testing: Accept any 6-digit code
    // In production, you would validate against the actual OTP
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new UnauthorizedException('Invalid OTP format');
    }

    // Find the most recent OTP for this user (for logging purposes)
    const latestOtp = await this.prisma.oTP.findFirst({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (latestOtp) {
      // Mark OTP as verified
      await this.prisma.oTP.update({
        where: { id: latestOtp.id },
        data: { verified: true },
      });
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.phone, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kyc?.status || null,
        trustScore: user.trustScore?.score || 0,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.phone, user.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        kyc: true,
        trustScore: true,
        vehicles: true,
        bookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const updateData: any = {};
    
    if (data.name && data.name.trim()) {
      updateData.name = data.name.trim();
    }
    
    if (data.email && data.email.trim()) {
      updateData.email = data.email.trim();
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        kyc: true,
        trustScore: true,
      },
    });

    return user;
  }

  private normalizePhone(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Add country code if missing (assuming Kenya)
    if (digits.length === 10) {
      return `+254${digits.slice(1)}`;
    }
    
    return `+${digits}`;
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateTokens(userId: string, phone: string, role: string): { accessToken: string; refreshToken: string } {
    const payload = { sub: userId, phone, role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '30d',
    });

    return { accessToken, refreshToken };
  }
}
