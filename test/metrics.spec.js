const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');

describe('/api/metrics', () => {

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db)
    })

    describe('GET /api/metrics', () => {
        context('When there are no metrics in the db', () => {
            it('responds with 200 and " metrics"', () => {
                return supertest(app)
                    .get('/api/metrics')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .expect(200, [])
            })
        })
    })
    
    describe('POST /api/metrics', () => {
        context('When the newMetric has all fields', () => {
            const newMetric = {
                "_id": "1903cce2-ff22-463b-b45d-06cb6e671880",
                "metric_name": "Plan"
            }

            it('responds with 201', () => {
                return supertest(app)
                    .post('/api/metrics')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .send(newMetric)
                    .expect(201)
            })
        })
    })
})