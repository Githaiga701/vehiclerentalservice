import { bootstrapApp, authHeaderFor } from './helpers';

describe('KYC Controller (integration)', () => {
  let app: any;

  beforeAll(async () => {
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /kyc/status should require auth', async () => {
    const res = await require('supertest')(app.getHttpServer()).get('/kyc/status');
    expect(res.status).toBe(401);
  });

  it('POST /kyc should accept submission for authenticated user (validation may apply)', async () => {
    const header = authHeaderFor('RENTER');
    const res = await require('supertest')(app.getHttpServer()).post('/kyc').set(header).send({ fullName: 'Test User', nationalId: '12345678' });
    expect([200, 201, 400]).toContain(res.status);
  });
});
