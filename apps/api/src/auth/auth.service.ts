import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../database/redis.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly whatsappService: WhatsAppService,
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

    // Store OTP in Redis if available, otherwise use database
    const expiresInSeconds = 300; // 5 minutes
    
    if (this.redisService.isAvailable()) {
      try {
        await this.redisService.setOtp(normalizedPhone, otpCode, expiresInSeconds);
        this.logger.log(`OTP stored in Redis for ${normalizedPhone}: ${otpCode}`);
      } catch (error) {
        this.logger.warn('Failed to store OTP in Redis, falling back to database');
        // Fallback to database
        await this.storeOtpInDatabase(user.id, otpCode, expiresInSeconds);
      }
    } else {
      // Use database storage
      await this.storeOtpInDatabase(user.id, otpCode, expiresInSeconds);
    }

    // In production, send OTP via WhatsApp or SMS
    if (this.whatsappService.isConfigured()) {
      await this.whatsappService.sendOTP(normalizedPhone, otpCode);
      this.logger.log(`WhatsApp OTP sent to ${normalizedPhone}`);
    } else {
      this.logger.log(`OTP for ${normalizedPhone}: ${otpCode}`);
    }

    return {
      message: 'OTP sent successfully',
      expiresIn: expiresInSeconds,
    };
  }

  private async storeOtpInDatabase(userId: string, otpCode: string, expiresInSeconds: number): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    await this.prisma.oTP.create({
      data: {
        userId,
        code: otpCode,
        expiresAt,
      },
    });
    this.logger.log(`OTP stored in database for user ${userId}`);
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

    // Validate OTP format
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new UnauthorizedException('Invalid OTP format');
    }

    // Check OTP in Redis first, then database
    let isValidOtp = false;
    
    if (this.redisService.isAvailable()) {
      try {
        const storedOtp = await this.redisService.getOtp(normalizedPhone);
        if (storedOtp === code) {
          isValidOtp = true;
          // Delete OTP after successful verification
          await this.redisService.deleteOtp(normalizedPhone);
          this.logger.log(`OTP verified from Redis for ${normalizedPhone}`);
        }
      } catch (error) {
        this.logger.warn('Failed to verify OTP from Redis, checking database');
      }
    }

    // If not found in Redis, check database
    if (!isValidOtp) {
      const latestOtp = await this.prisma.oTP.findFirst({
        where: {
          userId: user.id,
          code: code,
          expiresAt: { gt: new Date() },
          verified: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (latestOtp) {
        isValidOtp = true;
        // Mark OTP as verified
        await this.prisma.oTP.update({
          where: { id: latestOtp.id },
          data: { verified: true },
        });
        this.logger.log(`OTP verified from database for ${normalizedPhone}`);
      }
    }

    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
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

  async uploadProfilePicture(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new UnauthorizedException('No file provided');
    }

    // In a real app, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll store the filename
    const profilePictureUrl = `/uploads/profiles/${file.filename}`;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePictureUrl },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profilePicture: true,
      },
    });

    return {
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture,
      user,
    };
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
