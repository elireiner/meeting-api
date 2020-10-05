const MeetingsService = {
    
    getAllMeetings(knex) {
        return knex.select('*').from('meetings')
    },

    insertMeeting(knex, newMeeting) {
        return knex
            .insert(newMeeting)
            .into('meetings')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('meetings').select('*').where('_id', id).first()
    },

    deleteMeeting(knex, _id) {
        return knex('meetings')
            .where({ _id })
            .delete()
    },

   /* updateMeeting(knex, id, newMeetingFields) {
        return knex('meetings')
            .where({ id })
            .update(newMeetingFields)
    },*/
}

module.exports = MeetingsService