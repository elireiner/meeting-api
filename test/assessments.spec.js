const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const UsersService = require('../src/users/users-service')
const teamsService = require('../src/teams/teams-service.js')


describe.only('/api/assessments', () => {

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db)
    })

     describe('GET /api/assessments', () => {
         context('When there are assessments in the db', () => {
             it('responds with 200', () => {
                 return supertest(app)
                     .get('/api/assessments')
                     .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                     .expect(200)
             })
         })
     })

    /* describe('POST /api/assessments', () => {
         context('When the newAssessment has all fields', () => {
             const newUser = {
                 _id: '1903cce2-ff22-463b-b45d-06cb6e671897',
                 first_name: 'Sam',
                 last_name: 'Altman'
             };
             const newTeam = {
                 _id: '2703cce2-ff22-463b-b45d-06cb6e671897',
                 teams_name: 'Rustic Passion',
                 active: true
             };
             const newUserTeam = {
                 user_id: 1,
                 team_id: 1
             }
 
 
             before('Add user, team, and user-team', async () => {
                 await UsersService.insertUser(
                     db,
                     newUser
                 )
                     .then(async res => {
                         await teamsService.insertTeam(
                             db,
                             newTeam
                         )
                             .then(async res => {
                                 await teamsService.insertUserTeam(
                                     db,
                                     newUserTeam
                                 )
                             })
                             .catch()
                     })
                     .catch()
 
             })
 
             const newAssessment = {
                 "_id": "1903cce2-ff22-463b-b45d-06cb6e671880",
                 "assessment_name": "Plan",
                 "assessment_type": "Yearly",
                 "description": "Mollit ad labore commodo est sit mollit. Lorem ad sint et quis esse est magna aliqua id. Excepteur sint reprehenderit in excepteur exercitation. Elit minim consequat consequat laborum incididunt enim elit laborum consectetur reprehenderit irure amet culpa enim. Adipisicing enim ad exercitation excepteur anim labore culpa sit et consectetur occaecat dolore sunt. Adipisicing sint ut incididunt aliqua tempor aliquip.",
                 "user_team_id": 1,
                 "assessment_time": "5/6/2018, 9:33:06 PM"
             }
 
             it('responds with 201', () => {
                 return supertest(app)
                     .post('/api/assessments')
                     .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                     .send(newAssessment)
                     .expect(201)
             })
         })
     })*/
 
     describe('GET /api/assessments/user/:_Id', () => {
         context('When there is an assessment in the db', () => {
             it('responds with 200', () => {
                 return supertest(app)
                     .get('/api/assessments/user/1')
                     .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                     .expect(200)
             })
         })
     })

    /* describe('DELETE /api/assessments/:assessmentId', () => {
         context('When there is an assessment in the table', () => {
 
             after('Remove the user, team, and user-team added above', async () => {
                 await UsersService.deleteAllUsers(
                     db
                 )
                     .then(async res => {
                         await teamsService.deleteAllTeams(
                             db
                         )
                             .catch()
                     })
                     .catch()
 
             })
 
             it('responds with 204', () => {
                 return supertest(app)
                     .delete('/api/assessments/1903cce2-ff22-463b-b45d-06cb6e671880')
                     .set({ 'Authorization': `Bearer ${process.env.API_TOKEN}` })
                     .expect(204)
             })
         })
     })*/
})