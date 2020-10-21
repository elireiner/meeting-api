const path = require('path');
const express = require('express')
const xss = require('xss')
const teamsService = require('./teams-service')

const teamsRouter = express.Router()
//const jsonParser = express.json()

const serialize = user_team => ({
    user_team_id: user_team.user_team_id,
    _id: xss(user_team._id),
    user_team_name: xss(user_team.user_team_name)
})

teamsRouter
    .route('/')
    .all((req, res, next) => {
        const user_teamId = Number(req.params.user_team_id)
        teamsService.getAllTeams(
            req.app.get('db')
        )
            .then(teams => {
                if (!teams) {
                    return res.status(404).json({
                        error: { message: `There was an error when getting the teams` }
                    })
                }
                res.teams = teams;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json(res.teams)
    })

teamsRouter
    .route('/:user_id')
    .all((req, res, next) => {
        const user_Id = Number(req.params.user_id)
        teamsService.getById(
            req.app.get('db'),
            user_Id
        )
            .then(user_team => {
                if (!user_team) {
                    return res.status(404).json({
                        error: { message: `Team does not exist` }
                    })
                }
                res.user_team = user_team;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json(res.user_team.rows)
    })

module.exports = teamsRouter