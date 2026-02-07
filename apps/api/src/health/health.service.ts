import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    const startTime = Date.now();
    let databaseStatus: 'connected' | 'disconnected' = 'disconnected';
    let statusCode = HttpStatus.OK;

    try {
      // Execute lightweight DB query
      await this.prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'connected';
    } catch (error) {
      databaseStatus = 'disconnected';
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
    }

    const response = {
      status: databaseStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      database: databaseStatus,
      responseTime: Date.now() - startTime,
    };

    if (statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
      throw new Error(JSON.stringify(response));
    }

    return response;
  }
}
