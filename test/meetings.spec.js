const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');

describe('/api/ meetings', () => {

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db)
    })

    describe('GET /api/meetings', () => {
        context('When there are no meetings in the db', () => {
            it('responds with 200 and " meetings"', () => {
                return supertest(app)
                    .get('/api/meetings')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .expect(200, [])
            })
        })
    })

    describe('GET /api/meetings/:meetingId', () => {
        context('When there are no meetings in the db', () => {
            it('responds with 404', () => {
                return supertest(app)
                    .get('/api/meetings/1')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .expect(404)
            })
        })
    })
})