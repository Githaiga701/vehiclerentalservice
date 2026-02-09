import { bootstrapApp, authHeaderFor } from './helpers';

describe('Contact Controller (integration)', () => {
  let app: any;

  beforeAll(async () => {
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /contact should accept public messages', async () => {
    const res = await require('supertest')(app.getHttpServer()).post('/contact').send({ name: 'QA', email: 'qa@example.com', subject: 'Test', message: 'Hello' });
    expect([200, 201]).toContain(res.status);
  });

  it('GET /contact/admin/all should be admin-only', async () => {
    const header = authHeaderFor('RENTER');
    const res = await require('supertest')(app.getHttpServer()).get('/contact/admin/all').set(header);
    expect([401, 403]).toContain(res.status);
  });
});
