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
    describe('POST /api/meetings', () => {
        context('When the newMeeting has all fields', () => {
            const newMeeting = {
                "_id": "1903cce2-ff22-463b-b45d-06cb6e671880",
                "meeting_name": "Plan",
                "meeting_type": "Yearly",
                "description": "Mollit ad labore commodo est sit mollit. Lorem ad sint et quis esse est magna aliqua id. Excepteur sint reprehenderit in excepteur exercitation. Elit minim consequat consequat laborum incididunt enim elit laborum consectetur reprehenderit irure amet culpa enim. Adipisicing enim ad exercitation excepteur anim labore culpa sit et consectetur occaecat dolore sunt. Adipisicing sint ut incididunt aliqua tempor aliquip.",
                "meeting_time": "5/6/2018, 9:33:06 PM"
            }

            it('responds with 201', () => {
                return supertest(app)
                    .post('/api/meetings')
                    .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                    .send(newMeeting)
                    .expect(201)
            })
        })
    })
})