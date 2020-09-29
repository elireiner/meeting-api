const path = require('path');
const express = require('express')
const xss = require('xss')
const MeetingsService = require('./meetings-service')

const meetingRouter = express.Router()
const jsonParser = express.json()

const serialize = meeting => ({
    id: meeting.id,
    _id: xss(meeting._id),
    meeting_name: xss(meeting.meeting_name),
    meeting_type: xss(meeting.meeting_type),
    description: xss(meeting.description),
    meeting_time: xss(meeting.meeting_time),
})

meetingRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        MeetingsService.getAllMeetings(knexInstance)
            .then(meetings => {
                res.json(meetings.map(serialize))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { meeting_name } = req.body;
        const newMeeting = { meeting_name };

        if (!meeting_name) {
            return res.status(400).json({
                error: { message: `Missing 'meeting_name' in request body` }
            })
        }

        MeetingsService.insertMeeting(
            req.app.get('db'),
            newMeeting
        )

            .then(meeting => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${meeting.id}`))
                    .json(serialize(meeting))
            })
            .catch(next)
    })

meetingRouter
    .route('/:meeting_id')
    .all((req, res, next) => {
        const meetingId = Number(req.params.meeting_id)
        MeetingsService.getById(
            req.app.get('db'),
            meetingId
        )
            .then(meeting => {
                if (!meeting) {
                    return res.status(404).json({
                        error: { message: `Meeting does not exist` }
                    })
                }
                res.meeting = meeting;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json({
            id: res.meeting.id,
            _id: xss(res.meeting._id),
            first_name: xss(res.meeting.first_name),
            last_name: xss(res.meeting.last_name), //TODO: sanitize title with map serialize
        })
    })
/*.delete(jsonParser, (req, res, next) => {
    MeetingsService.deleteMeeting(req.app.get('db'),
        req.params.meeting_id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
})
.patch(jsonParser, (req, res, next) => {
    const { meeting_name } = req.body;
    const meetingToUpdate = { meeting_name }


    if (!meeting_name) {
        return res.status(400).json({
            error: { message: `Request body must contain a meeting_name ` }
        })
    }

    MeetingsService.updateMeeting(
        req.app.get('db'),
        req.params.meeting_id,
        meetingToUpdate
    )

        .then(numRowsAffected => {
            res.status(204).end()
        })

        .catch(next)
})*/

module.exports = meetingRouter