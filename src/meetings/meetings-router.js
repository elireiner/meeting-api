const path = require('path');
const express = require('express')
const xss = require('xss')
const MeetingsService = require('./meetings-service')

const meetingRouter = express.Router()
const jsonParser = express.json()

const serialize = meeting => ({
    meeting_id: meeting.meeting_id,
    _id: xss(meeting._id),
    meeting_name: xss(meeting.meeting_name),
    meeting_type: xss(meeting.meeting_type),
    description: xss(meeting.description),
    recurring: meeting.recurring,
    recurring_id: meeting.recurring_id,
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
        const { _id, meeting_name, meeting_type, description, user_team_id, recurring, recurring_id, meeting_time, participants } = req.body;
        const newMeeting = { _id, meeting_name, meeting_type, description, user_team_id, recurring, recurring_id, meeting_time };

        for (const [key, value] of Object.entries(newMeeting)) {
            if (!value) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        MeetingsService.insertMeeting(
            req.app.get('db'),
            newMeeting
        )
            .then(res => {
                //Check if meeting id came back
                if (res.meeting_id > 0) {
                    //TODO: look into bulk insert
                    //loop over participants array
                    participants.map(participant => {
                        MeetingsService.insertParticipants(
                            req.app.get('db'),
                            res.meeting_id,
                            participant
                        )
                    })
                }
            })
            .then(meeting => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${meeting.meeting_id}`))
                    .json(serialize(meeting))
            })
            .catch(next)
    })

meetingRouter
    .route('/meeting/:_id')
    .all((req, res, next) => {
        const meetingId = req.params._id
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
            meeting_id: res.meeting.meeting_id,
            _id: xss(res.meeting._id),
            meeting_name: xss(res.meeting.meeting_name),
            meeting_type: xss(res.meeting.meeting_type),
            description: xss(res.meeting.description),
            recurring: res.meeting.recurring,
            recurring_id: res.meeting.recurring_id,
            meeting_time: xss(res.meeting.meeting_time), //TODO: sanitize title with map serialize
        })
    })
    .delete(jsonParser, (req, res, next) => {
        MeetingsService.deleteMeeting(
            req.app.get('db'),
            req.params._id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
/*.patch(jsonParser, (req, res, next) => {
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


meetingRouter
    .route('/user/:_id')
    .all((req, res, next) => {
        const userId = req.params._id
        MeetingsService.getByUserId(
            req.app.get('db'),
            userId
        )
            .then(meeting => {
                if (!meeting) {
                    return res.status(404).json({
                        error: { message: `User does not exist` }
                    })
                }
                res.meeting = meeting.rows;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        const meetings = res.meeting.map(meeting => {
            return {
                meeting_id: meeting.meeting_id,
                _id: xss(meeting._id),
                meeting_name: xss(meeting.meeting_name),
                meeting_type: xss(meeting.meeting_type),
                description: xss(meeting.description),
                recurring: res.meeting.recurring,
                recurring_id: res.meeting.recurring_id,
                meeting_time: xss(meeting.meeting_time) //TODO: sanitize title with map serialize
            }
        })
        
        res.json(meetings)
    })

module.exports = meetingRouter