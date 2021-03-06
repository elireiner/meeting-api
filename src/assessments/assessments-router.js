const path = require('path');
const express = require('express')
const xss = require('xss')
const AssessmentsService = require('./assessments-service')

const assessmentRouter = express.Router()
const jsonParser = express.json()

const serialize = assessment => ({
    assesment_pkey: assessment.assesment_pkey,
    _id: xss(assessment._id),
    metric_id: assessment.metric_id,
    metric_value: assessment.metric_value,
    user_id: assessment.user_id,
    meeting_id: assessment.meeting_id
})

assessmentRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        AssessmentsService.getAllAssessments(knexInstance)
            .then(assessments => {
                res.json(assessments.map(serialize))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        let { _id, metric_id, metric_value, user_id, meeting_id } = req.body;

        metric_id = Number(metric_id);
        metric_value = Number(metric_value);
        user_id = Number(user_id);
        meeting_id = Number(meeting_id);

        const newAssessment = { _id, metric_id, metric_value, user_id, meeting_id };

        for (const [key, value] of Object.entries(newAssessment)) {
            if (!value) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

  
         AssessmentsService.insertAssessment(
             req.app.get('db'),
             newAssessment
         )
             .then(assessment => {
                 res
                     .status(201)
                     .location(path.posix.join(req.originalUrl, `/${assessment.rows[0].assesment_pkey}`))
                     .json(serialize(assessment.rows[0]))
             })
             .catch(next)
    })


assessmentRouter
    .route('/:user_id')
    .all((req, res, next) => {
        const userId = Number(req.params.user_id)
        AssessmentsService.getAllAssessmentsForUser(
            req.app.get('db'),
            userId
        )
            .then(assessments => {
                if (!assessments) {
                    return res.status(404).json({
                        error: { message: `There are no assessments for this user` }
                    })
                }
                res.assessments = assessments.rows;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.status(200).json(res.assessments)
    })
/*  .delete(jsonParser, (req, res, next) => {
        AssessmentsService.deleteAssessment(req.app.get('db'),
            req.params._id)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
.patch(jsonParser, (req, res, next) => {
    const { assessment_name } = req.body;
    const assessmentToUpdate = { assessment_name }


    if (!assessment_name) {
        return res.status(400).json({
            error: { message: `Request body must contain a assessment_name ` }
        })
    }

    AssessmentsService.updateAssessment(
        req.app.get('db'),
        req.params.assessment_id,
        assessmentToUpdate
    )

        .then(numRowsAffected => {
            res.status(204).end()
        })

        .catch(next)
})*/

assessmentRouter
    .route('/:user_id/:meeting_id')
    .all((req, res, next) => {
        const userId = Number(req.params.user_id);
        const meetingId = Number(req.params.meeting_id);
        AssessmentsService.getUserAssessmentForMeeting(
            req.app.get('db'),
            userId,
            meetingId
        )
            .then(assessment => {
                if (!assessment) {
                    return res.status(404).json({
                        error: { message: `Assessment does not exist` }
                    })
                }
                res.assessment = assessment.rows;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        //todo: serialize response
        res.status(200).json(res.assessment)
    })


assessmentRouter
    .route('/trends/individual-meetings/:user_id')
    .all((req, res, next) => {
        const userId = Number(req.params.user_id)
        console.log(userId)
        AssessmentsService.getUsersMeetingsAssessAvg(
            req.app.get('db'),
            userId
        )
            .then(assessment => {
                if (!assessment) {
                    return res.status(404).json({
                        error: { message: `Assessment does not exist` }
                    })
                }
                res.assessment = assessment;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.status(200).json(res.assessment)
    })


//todo: change getUsersMeetingsAssessAvg to getUsersOneMeetingsAssessAvg; and add service method

/*assessmentRouter
    .route('/trends/individual-meetings/:user_id/:meetingId')
    .all((req, res, next) => {
        const userId = Number(req.params._id)
        const meetingId = Number(req.params.meetingId)

        AssessmentsService.getUsersMeetingsAssessAvg(
            req.app.get('db'),
            userId
        )
            .then(assessment => {
                if (!assessment) {
                    return res.status(404).json({
                        error: { message: `Assessment does not exist` }
                    })
                }
                res.assessment = assessment;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.status(200).json(res.assessment)
    })
    */

assessmentRouter
    .route('/trends/cumulative/:user_id/:recurringMeetingId')
    .all((req, res, next) => {
        const userId = Number(req.params.user_id)
        const recurringMeetingId = Number(req.params.recurringMeetingId)
        console.log("test")
        AssessmentsService.getUsersRecurringMeetingsAssessAvgForRecurring(
            req.app.get('db'),
            userId,
            recurringMeetingId
        )
            .then(assessment => {
                if (!assessment) {
                    return res.status(404).json({
                        error: { message: `Assessment does not exist` }
                    })
                }
                res.assessment = assessment.rows;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.status(200).json(res.assessment)
    })


//todo: change getUsersRecurringMeetingsAssessAvg to getUsersOneRecurringMeetingsAssessAvg; and add service method
/* 
 
assessmentRouter
 .route('/trends/cumulative/:user_id/:recurring_meeting_id')
 .all((req, res, next) => {
     const userId = Number(req.params.user_id)
     const recurringMeetingId = Number(req.params.recurring_meeting_id)
     
     AssessmentsService.getUsersRecurringMeetingsAssessAvg(
         req.app.get('db'),
         userId,
         recurringMeetingId
     )
         .then(assessment => {
             if (!assessment) {
                 return res.status(404).json({
                     error: { message: `Assessment does not exist` }
                 })
             }
             res.assessment = assessment;
             next()
         })
         .catch(next)

 })
 .get((req, res, next) => {
     res.status(200).json(res.assessment)
 })*/

module.exports = assessmentRouter