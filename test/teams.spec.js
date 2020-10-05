const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');

describe('/api/teams', () => {

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db)
    })

    describe('GET /api/teams', () => {
        context('When there are no users in the db', () => {
            it('responds with 200', () => {
                return supertest(app)
                    .get('/api/teams')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .expect(200)
            })
        })
    })

    describe('GET /api/teams/:userId', () => {
        context('When there are no users in the db', () => {
            it('responds with 200', () => {
                return supertest(app)
                    .get('/api/teams/1')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .expect(404)
            })
        })
    })
})