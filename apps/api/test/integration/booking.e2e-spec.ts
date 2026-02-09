import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

// Adjust import path to your AppModule location
import { AppModule } from '../../../src/app.module';

describe('Booking API (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /bookings should deny unauthenticated users', async () => {
    await request(app.getHttpServer()).post('/bookings').send({}).expect(401);
  });

  it('GET /vehicles should return list (public)', async () => {
    const res = await request(app.getHttpServer()).get('/vehicles').expect(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });
});
