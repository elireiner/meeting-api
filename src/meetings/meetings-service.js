const MeetingsService = {
    
    getAllMeetings(knex) {
        return knex.select('*').from('meetings')
    },

    insertMeeting(knex, newMeeting) {
        return knex
            .insert(newMeeting)
            .into('mvp_meetings')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    
//TODO: look into bulk insert
    insertParticipants(knex, meetingId, participant) {
        return knex
            .insert(participant)
            .into('user_meeting')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('meetings').select('*').where('_id', id).first()
    },

    getByUserId(knex, id) {
        return knex.raw(`select * from meetings inner join user_meeting on meetings.meeting_id=user_meeting.meeting_id inner join users on user_meeting.user_id=users.user_id where users.user_id=?;`, [id])
    },
    
    deleteMeeting(knex, _id) {
        return knex('meetings')
            .where({ _id })
            .delete()
    },

    getUsersRecurringMeetingNames(knex, id) {
        return knex.raw(`select distinct recurring_meetings.recurring_meeting_name, recurring_meetings.recurring_meeting_id from recurring_meetings inner join meetings on recurring_meetings.recurring_meeting_id=meetings.recurring_id 
        inner join user_meeting on meetings.meeting_id=user_meeting.meeting_id where user_meeting.user_id=?`, [id])
    },

   /* updateMeeting(knex, id, newMeetingFields) {
        return knex('meetings')
            .where({ id })
            .update(newMeetingFields)
    },*/
}

module.exports = MeetingsService