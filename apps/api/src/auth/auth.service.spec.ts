import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { mockPrismaService } from '../test/test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: typeof mockPrismaService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        JWT_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = mockPrismaService;
    jwtService = module.get<JwtService>(JwtService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestOtp', () => {
    it('should create OTP for existing user', async () => {
      const phone = '+254712345678';
      const mockUser = {
        id: 'user-1',
        phone,
        role: 'RENTER',
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.oTP.create.mockResolvedValue({
        id: 'otp-1',
        userId: mockUser.id,
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: false,
        createdAt: new Date(),
      });

      const result = await service.requestOtp(phone);

      expect(result).toEqual({
        message: 'OTP sent successfully',
        expiresIn: 300,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { phone },
      });
      expect(prisma.oTP.create).toHaveBeenCalled();
    });

    it('should create new user if not exists', async () => {
      const phone = '+254712345678';
      const mockUser = {
        id: 'user-1',
        phone,
        role: 'RENTER',
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.trustScore.create.mockResolvedValue({
        id: 'trust-1',
        userId: mockUser.id,
        score: 0,
      });
      prisma.oTP.create.mockResolvedValue({
        id: 'otp-1',
        userId: mockUser.id,
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: false,
        createdAt: new Date(),
      });

      const result = await service.requestOtp(phone);

      expect(result).toEqual({
        message: 'OTP sent successfully',
        expiresIn: 300,
      });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.trustScore.create).toHaveBeenCalled();
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP and return tokens', async () => {
      const phone = '+254712345678';
      const code = '123456';
      const mockUser = {
        id: 'user-1',
        phone,
        name: 'Test User',
        email: 'test@example.com',
        role: 'RENTER',
        isActive: true,
        kyc: { status: 'PENDING' },
        trustScore: { score: 0 },
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.oTP.findFirst.mockResolvedValue({
        id: 'otp-1',
        userId: mockUser.id,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: false,
        createdAt: new Date(),
      });
      prisma.oTP.update.mockResolvedValue({
        id: 'otp-1',
        userId: mockUser.id,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        verified: true,
        createdAt: new Date(),
      });

      const result = await service.verifyOtp(phone, code);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(mockUser.id);
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      const phone = '+254712345678';
      const code = '123456';

      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.verifyOtp(phone, code)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid OTP format', async () => {
      const phone = '+254712345678';
      const code = '12345'; // Invalid: only 5 digits

      const mockUser = {
        id: 'user-1',
        phone,
        role: 'RENTER',
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.verifyOtp(phone, code)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockUser = {
        id: 'user-1',
        phone: '+254712345678',
        role: 'RENTER',
        isActive: true,
      };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        phone: mockUser.phone,
        role: mockUser.role,
      });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.refreshToken(refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-refresh-secret',
      });
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const refreshToken = 'invalid-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user with relations', async () => {
      const userId = 'user-1';
      const mockUser = {
        id: userId,
        phone: '+254712345678',
        name: 'Test User',
        email: 'test@example.com',
        role: 'RENTER',
        isActive: true,
        kyc: { status: 'APPROVED' },
        trustScore: { score: 85 },
        vehicles: [],
        bookings: [],
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getCurrentUser(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
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
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 'non-existent';

      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getCurrentUser(userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = 'user-1';
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };
      const mockUser = {
        id: userId,
        phone: '+254712345678',
        name: updateData.name,
        email: updateData.email,
        role: 'RENTER',
        isActive: true,
        kyc: null,
        trustScore: { score: 0 },
      };

      prisma.user.update.mockResolvedValue(mockUser);

      const result = await service.updateProfile(userId, updateData);

      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: updateData.name,
          email: updateData.email,
        },
        include: {
          kyc: true,
          trustScore: true,
        },
      });
    });

    it('should trim whitespace from inputs', async () => {
      const userId = 'user-1';
      const updateData = {
        name: '  Spaced Name  ',
        email: '  spaced@example.com  ',
      };

      prisma.user.update.mockResolvedValue({
        id: userId,
        name: 'Spaced Name',
        email: 'spaced@example.com',
      });

      await service.updateProfile(userId, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: 'Spaced Name',
            email: 'spaced@example.com',
          },
        }),
      );
    });
  });
});
