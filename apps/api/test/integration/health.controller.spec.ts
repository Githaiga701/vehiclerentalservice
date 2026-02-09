import { bootstrapApp } from './helpers';

describe('Health Controller (integration)', () => {
  let app: any;

  beforeAll(async () => {
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return service health', async () => {
    const res = await require('supertest')(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
