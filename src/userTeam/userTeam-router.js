const path = require('path');
const express = require('express')
const xss = require('xss')
const userTeamService = require('./userTeam-service')

const userTeamRouter = express.Router()
//const jsonParser = express.json()

const serialize = user_team => ({
    user_team_id: user_team.user_team_id,
    _id: xss(user_team._id),
    user_team_name: xss(user_team.user_team_name)
})

userTeamRouter
    .route('/:user_id')
    .all((req, res, next) => {
        const user_teamId = Number(req.params.user_team_id)
        userTeamService.getById(
            req.app.get('db'),
            user_teamId
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

module.exports = userTeamRouter