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

    getAllAssessmentsForMeeting(knex, id) {
        return knex.raw(`select assesment.assesment_pkey, assesment._id, metrics.metric_id, metrics.metric_name, assesment.metric_value, assesment.meeting_id from assesment inner join metrics on assesment.metric_id=metrics.metric_id where meeting_id = ?;`, [id])
    },

    getUsersRecurringMeetingsAssessAvg(knex, id) {
        return knex.raw(`select user_meeting.user_id as current_user, assesment.meeting_id, assesment.metric_id, metrics.metric_name, avg(metric_value)::NUMERIC(10,2)
        from metrics
        inner join assesment 
          on metrics.metric_id=assesment.metric_id 
        inner join user_meeting 
          on  assesment.meeting_id=user_meeting.meeting_id  
        where user_meeting.user_id = ?
        group by assesment.metric_id, assesment.meeting_id, metrics.metric_name, user_meeting.user_id, user_meeting.meeting_id
        order by assesment.meeting_id, assesment.metric_id;`, [id])
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