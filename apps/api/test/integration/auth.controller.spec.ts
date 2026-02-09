import { bootstrapApp, authHeaderFor } from './helpers';

describe('Auth Controller (integration)', () => {
  let app: any;

  beforeAll(async () => {
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /auth/me should return 401 without token', async () => {
    const res = await require('supertest')(app.getHttpServer()).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /auth/me should return 200 for seeded renter', async () => {
    const header = authHeaderFor('RENTER');
    const res = await require('supertest')(app.getHttpServer()).get('/auth/me').set(header);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });
});
