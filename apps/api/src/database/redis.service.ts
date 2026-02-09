import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    
    if (redisUrl) {
      try {
        this.client = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        this.client.on('connect', () => {
          this.logger.log('Connected to Redis');
        });

        this.client.on('error', (error) => {
          this.logger.error('Redis connection error:', error);
        });

        // Test connection
        await this.client.ping();
        this.logger.log('Redis connection verified');
      } catch (error) {
        this.logger.warn('Redis not available, falling back to database storage');
        this.client = null;
      }
    } else {
      this.logger.warn('REDIS_URL not configured, using database for OTP storage');
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  isAvailable(): boolean {
    return this.client !== null && this.client.status === 'ready';
  }

  /**
   * Store OTP in Redis with expiration
   */
  async setOtp(phone: string, otp: string, expiresInSeconds: number = 300): Promise<void> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    const key = `otp:${phone}`;
    await this.client.setex(key, expiresInSeconds, otp);
    this.logger.log(`OTP stored in Redis for ${phone}`);
  }

  /**
   * Get OTP from Redis
   */
  async getOtp(phone: string): Promise<string | null> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    const key = `otp:${phone}`;
    const otp = await this.client.get(key);
    return otp;
  }

  /**
   * Delete OTP from Redis
   */
  async deleteOtp(phone: string): Promise<void> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    const key = `otp:${phone}`;
    await this.client.del(key);
    this.logger.log(`OTP deleted from Redis for ${phone}`);
  }

  /**
   * Get all OTPs (for admin/testing purposes)
   */
  async getAllOtps(): Promise<{ phone: string; otp: string; ttl: number }[]> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    const keys = await this.client.keys('otp:*');
    const otps = [];

    for (const key of keys) {
      const phone = key.replace('otp:', '');
      const otp = await this.client.get(key);
      const ttl = await this.client.ttl(key);
      
      if (otp) {
        otps.push({ phone, otp, ttl });
      }
    }

    return otps;
  }

  /**
   * Generic set with expiration
   */
  async set(key: string, value: string, expiresInSeconds?: number): Promise<void> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    if (expiresInSeconds) {
      await this.client.setex(key, expiresInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Generic get
   */
  async get(key: string): Promise<string | null> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    return await this.client.get(key);
  }

  /**
   * Generic delete
   */
  async delete(key: string): Promise<void> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    await this.client.del(key);
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isAvailable() || !this.client) {
      throw new Error('Redis not available');
    }

    const result = await this.client.exists(key);
    return result === 1;
  }
}
