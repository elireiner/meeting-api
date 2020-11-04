const AssessmentsService = {

    getAllAssessments(knex) {
        return knex.select('*').from('assesment')
    },

    insertAssessment(knex, newAssessment) {
        return knex.raw(`insert into assesment (_id, metric_id, metric_value, user_id, meeting_id) 
        values (:_id, :metric_id, :metric_value, :user_id, :meeting_id) RETURNING *;`, newAssessment)

    },

    getAllAssessmentsForUser(knex, id) {
        return knex.raw(`select assesment.assesment_pkey, assesment._id, metrics.metric_id, metrics.metric_name, assesment.metric_value, assesment.meeting_id from assesment inner join metrics on assesment.metric_id=metrics.metric_id where user_id = ? order by meeting_id;`, [id])
    },

    getUserAssessmentForMeeting(knex, userId, meetingId) {
        return knex.raw(`select * from assesment where user_id = :userId: and meeting_id = :meetingId:;`, {
            userId, meetingId
        })
    },

    // get the average for each meeting a user was a participant
    getUsersMeetingsAssessAvg(knex, id) {
  
        const subColumn = knex.raw('select distinct meeting_id from user_meeting where user_meeting.user_id = ?', [id])
            .wrap('(', ')');

        return knex('assesment')
            .select(knex.raw(`assesment.meeting_id, assesment.metric_id, avg(metric_value)::NUMERIC(10,2) as average`))
            .where(knex.raw(`assesment.meeting_id in :subColumn:`, {subColumn}))
            .groupBy(knex.raw(`assesment.metric_id, assesment.meeting_id`))
            .orderBy(knex.raw(`assesment.meeting_id, assesment.metric_id`))
    },

    // get the cumulative average of a recurring meeting a user was a participant
    getUsersRecurringMeetingsAssessAvgForRecurring(knex, userId, recurringMeetingId) {
        return knex.raw(`select meetings.recurring_id, assesment.metric_id, avg(individual_avg) as cumulative_avg
        from (select assesment.meeting_id, assesment.metric_id, avg(metric_value) as individual_avg
                from assesment 
                  where assesment.meeting_id in (select distinct meeting_id from user_meeting where user_meeting.user_id=?)
                group by assesment.metric_id, assesment.meeting_id
                order by assesment.meeting_id, assesment.metric_id) as individual_meetings inner join meetings on individual_meetings.meeting_id=meetings.meeting_id
                inner join assesment on meetings.meeting_id=assesment.meeting_id
                group by meetings.recurring_id, assesment.metric_id
                having meetings.recurring_id=??;`, [userId, recurringMeetingId])
    },

    /*deleteAssessment(knex, id) {
        return knex('assessments')
            .where({ id })
            .delete()
    },

    updateAssessment(knex, id, newAssessmentFields) {
        return knex('assessments')
            .where({ id })
            .update(newAssessmentFields)
    },*/
}

module.exports = AssessmentsService