const path = require('path');
const express = require('express')
const xss = require('xss')
const MetricsService = require('./metrics-service')

const metricRouter = express.Router()
const jsonParser = express.json()

const serialize = metric => ({
    metric_id: metric.metric_id,
    _id: xss(metric._id),
    metric_name: xss(metric.metric_name)
})

metricRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        MetricsService.getAllMetrics(knexInstance)
            .then(metrics => {
                res.json(metrics.map(serialize))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { _id, metric_name } = req.body;
        const newMetric = { _id, metric_name};

        for (const [key, value] of Object.entries(newMetric)){
            if (!value) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        MetricsService.insertMetric(
            req.app.get('db'),
            newMetric
        )
            .then(metric => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${metric.metric_id}`))
                    .json(serialize(metric))
            })
            .catch(next)
    })

metricRouter
    .route('/:metric_id')
    .all((req, res, next) => {
        const metricId = Number(req.params.metric_id)
        MetricsService.getById(
            req.app.get('db'),
            metricId
        )
            .then(metric => {
                if (!metric) {
                    return res.status(404).json({
                        error: { message: `Metric does not exist` }
                    })
                }
                res.metric = metric;
                next()
            })
            .catch(next)

    })
/*.delete(jsonParser, (req, res, next) => {
    MetricsService.deleteMetric(req.app.get('db'),
        req.params.metric_id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
})
.patch(jsonParser, (req, res, next) => {
    const { metric_name } = req.body;
    const metricToUpdate = { metric_name }


    if (!metric_name) {
        return res.status(400).json({
            error: { message: `Request body must contain a metric_name ` }
        })
    }

    MetricsService.updateMetric(
        req.app.get('db'),
        req.params.metric_id,
        metricToUpdate
    )

        .then(numRowsAffected => {
            res.status(204).end()
        })

        .catch(next)
})*/

module.exports = metricRouter