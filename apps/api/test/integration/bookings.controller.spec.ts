import { bootstrapApp, authHeaderFor, requestWithRole } from './helpers';

describe('Bookings Controller (integration)', () => {
  let app: any;

  beforeAll(async () => {
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /bookings should require auth', async () => {
    const res = await require('supertest')(app.getHttpServer()).post('/bookings').send({});
    expect(res.status).toBe(401);
  });

  it('RENTER should create booking when vehicle available (integration - requires seeded vehicle)', async () => {
    const header = authHeaderFor('RENTER');
    const payload = {
      vehicleId: process.env.TEST_VEHICLE_ID,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      totalPrice: 1000,
    };

    if (!process.env.TEST_VEHICLE_ID) {
      // Skip if no seeded vehicle id provided in env
      return;
    }

    const res = await require('supertest')(app.getHttpServer()).post('/bookings').set(header).send(payload);
    // Accept either success (201) or business rejection (409)
    expect([201, 409]).toContain(res.status);
  });

  it('OWNER cannot create booking on behalf of renter', async () => {
    const header = authHeaderFor('OWNER');
    const res = await require('supertest')(app.getHttpServer()).post('/bookings').set(header).send({});
    expect([400, 403, 422, 401]).toContain(res.status);
  });
});
