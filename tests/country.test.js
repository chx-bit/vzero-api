import supertest from 'supertest';
import app from '../src/index.js';

describe('Country API V1 Unit Tests', () => {
    describe('GET /v1/countries', () => {
        it('should fetch all countries without government data', async () => {
            const res = await supertest(app).get('/v1/countries');
            expect(res.status).toBe(200);
            expect(res.body).not.toHaveProperty('government');
        });
    });

    describe('GET /v1/countries?government=true', () => {
        it('should fetch all countries with government data', async () => {
            const res = await supertest(app).get(
                '/v1/countries?government=true'
            );
            expect(res.status).toBe(200);
            expect(res.body.data[0]).toHaveProperty('government');
        });
    });

    describe('GET /v1/countries?name=X', () => {
        it('should filter by country name and include government data', async () => {
            const res = await supertest(app).get(
                '/v1/countries?name=indonesia'
            );
            expect(res.status).toBe(200);
            expect(res.body.data[0].name).toBe('Indonesia');
            expect(res.body.data[0]).toHaveProperty('government');
        });
    });

    describe('Other Filters (No Gov Data)', () => {
        it('should filter by capital without government data', async () => {
            const res = await supertest(app).get(
                '/v1/countries?capital=jakarta'
            );
            expect(res.body.data[0]).not.toHaveProperty('government');
        });

        it('should filter by region without government data', async () => {
            const res = await supertest(app).get('/v1/countries?region=asia');
            expect(res.body.data[0]).not.toHaveProperty('government');
        });
    });

    describe('GET /v1/countries?govType=X', () => {
        it('should filter by government type and include government data', async () => {
            const res = await supertest(app).get(
                '/v1/countries?govType=presidential'
            );
            expect(res.status).toBe(200);
            expect(res.body.data[0]).toHaveProperty('government');
            expect(res.body.data[0].government.type).toContain('presidential');
        });
    });

    describe('GET /v1/countries/:code', () => {
        it('should fetch single country by ISO2 code', async () => {
            const res = await supertest(app).get('/v1/countries/ID');
            expect(res.status).toBe(200);
            expect(res.body.data[0].iso2).toBe('ID');
            expect(res.body.data[0]).toHaveProperty('government');
        });

        it('should return 400 for non-existent country code', async () => {
            const res = await supertest(app).get('/v1/countries/XX');
            expect(res.status).toBe(400);
            expect(res.body.data).toBeUndefined();
        });
    });
});
