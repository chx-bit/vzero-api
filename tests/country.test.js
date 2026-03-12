import supertest from 'supertest';
import app from '../src/index.js';

describe('GET /v1/countries?name=xxx', () => {
  it('should can get country by name', async () => {
    const result = await supertest(app).get('/v1/countries?name=indonesia');

    expect(result.body.data).toBeDefined();
  });
});
