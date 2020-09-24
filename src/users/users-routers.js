const path = require('path');
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serialize = user => ({
    id: user.id,
    user_name: user.user_name
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        res.json('users')
       // const knexInstance = req.app.get('db');
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serialize))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
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
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(serialize(user))
            })
            .catch(next)
    })

usersRouter
    .route('/user/:user_id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.user_id
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
            id: res.user.id,
            user_name: xss(res.user_name), // sanitize title
        })
    })
    .delete(jsonParser, (req, res, next) => {
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
                error: {message: `Request body must contain a user_name `}
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
    })

module.exports = usersRouter