import { bootstrapApp, authHeaderFor } from './helpers';

describe('Vehicles Controller (integration)', () => {
  let app: any;

  beforeAll(async () => {
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /vehicles should be public and return 200', async () => {
    const res = await require('supertest')(app.getHttpServer()).get('/vehicles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /vehicles/admin/pending should be forbidden for renter', async () => {
    const header = authHeaderFor('RENTER');
    const res = await require('supertest')(app.getHttpServer()).get('/vehicles/admin/pending').set(header);
    expect([401, 403].includes(res.status)).toBe(true);
  });

  it('GET /vehicles/admin/pending should be allowed for admin', async () => {
    const header = authHeaderFor('ADMIN');
    const res = await require('supertest')(app.getHttpServer()).get('/vehicles/admin/pending').set(header);
    expect([200, 204]).toContain(res.status);
  });
});
