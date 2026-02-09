import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

// Helper to bootstrap the Nest app once per suite
export async function bootstrapApp(): Promise<INestApplication> {
  // Import AppModule dynamically to avoid TypeScript compile issues in tests
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { AppModule } = require('../../../src/app.module');
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

// Auth header helper — test tokens must be supplied via environment in CI/deployment
export function authHeaderFor(role: 'RENTER' | 'OWNER' | 'ADMIN') {
  const envMap: Record<string, string | undefined> = {
    RENTER: process.env.TEST_TOKEN_RENTER,
    OWNER: process.env.TEST_TOKEN_OWNER,
    ADMIN: process.env.TEST_TOKEN_ADMIN,
  };

  const token = envMap[role];
  if (!token) {
    throw new Error(`Missing TEST_TOKEN_${role} environment variable for integration tests`);
  }

  return { Authorization: `Bearer ${token}` };
}

// Convenience wrapper for supertest with auth
export function requestWithRole(app: INestApplication, role: 'RENTER' | 'OWNER' | 'ADMIN') {
  return request(app.getHttpServer()).set(authHeaderFor(role));
}
