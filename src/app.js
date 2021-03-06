require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
//const debug = require('debug')('express:view')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
//winston is a logger
const winston = require('winston');
const usersRouter = require('./users/users-routers')
const meetingRouter = require('./meetings/meetings-router')
const departmentRouter = require('./departments/departments-router')
const metricRouter = require('./metrics/metrics-router')
const teamsRouter = require('./teams/teams-router')
const assessmentRouter = require('./assessments/assessments-router')

const app = express()

//debug('booting %o', name);

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'dev';

app.use(morgan(morganOption))
app.use(express.json())
app.use(helmet())
app.use(cors())

// set up winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'info.log' })
    ]
});

// continue winston set up to log to console when in development
if (NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`);
        console.trace(authToken)
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/users', usersRouter)

app.use('/api/meetings', meetingRouter)

app.use('/api/departments', departmentRouter)

app.use('/api/metrics', metricRouter)

app.use('/api/teams', teamsRouter)

app.use('/api/assessments', assessmentRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app