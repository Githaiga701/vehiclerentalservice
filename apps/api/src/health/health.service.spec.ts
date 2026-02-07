import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';
import { PrismaService } from '../database/prisma.service';
import { mockPrismaService } from '../test/test-utils';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prisma = mockPrismaService;

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return healthy status when database is connected', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.check();

      expect(result).toMatchObject({
        status: 'ok',
        database: 'connected',
        environment: expect.any(String),
        uptime: expect.any(Number),
        timestamp: expect.any(String),
        responseTime: expect.any(Number),
      });
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });

    it('should throw error when database is disconnected', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Connection failed'));

      await expect(service.check()).rejects.toThrow();
    });

    it('should include response time in result', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.check();

      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(typeof result.responseTime).toBe('number');
    });
  });
});
