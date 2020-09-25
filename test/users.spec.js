const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');

describe('/api/users', () => {

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db)
    })

    describe('GET /api/user', () => {
        context('When there is no db', () => {
            it('responds with 200 and "users"', () => {
                return supertest(app)
                    .get('/api/users')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .expect(200, 'users')
            })
        })
    })
})