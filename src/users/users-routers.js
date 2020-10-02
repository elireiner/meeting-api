const path = require('path');
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serialize = user => ({
    user_id: user.user_id,
    _id: xss(user._id),
    first_name: xss(user.first_name),
    last_name: xss(user.last_name)
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serialize))
            })
            .catch(next)
    })
    /*.post(jsonParser, (req, res, next) => {
        const { user_name } = req.body;
        const newUser = { user_name };

        if (!user_name) {
            return res.status(400).json({
                error: { message: `Missing 'user_name' in request body` }
            })
        }

        UsersService.insertUser(
            req.app.get('db'),
            newUser
        )

            .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
                    .json(serialize(user))
            })
            .catch(next)
    })*/

usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
       const userId = Number(req.params.user_id)
        UsersService.getById(
            req.app.get('db'),
            userId
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User does not exist` }
                    })
                }
                res.user = user;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json({
            user_id: res.user.user_id,
            _id: xss(res.user._id),
            first_name: xss(res.user.first_name),
            last_name:  xss(res.user.last_name), //TODO: sanitize title with map serialize
        })
    })
    /*.delete(jsonParser, (req, res, next) => {
        UsersService.deleteUser(req.app.get('db'),
            req.params.user_id)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { user_name } = req.body;
        const userToUpdate = { user_name }


        if (!user_name) {
            return res.status(400).json({
                error: { message: `Request body must contain a user_name ` }
            })
        }

        UsersService.updateUser(
            req.app.get('db'),
            req.params.user_id,
            userToUpdate
        )

            .then(numRowsAffected => {
                res.status(204).end()
            })

            .catch(next)
    })*/

module.exports = usersRouter