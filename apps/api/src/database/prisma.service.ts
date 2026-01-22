import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Allow the app to boot even if DATABASE_URL isn't configured yet.
    // (Useful for early scaffolding / CI / local dev without DB.)
    if (!process.env.DATABASE_URL) {
      this.logger.warn('DATABASE_URL is not set; skipping Prisma connection.');
      return;
    }

    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

