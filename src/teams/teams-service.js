const teamsService = {
    
    getAllTeams(knex) {
        return knex.select('*').from('teams')
    },
// TODO: dynamically use the id
// TODO: change to getByUserId
    getById(knex, id) {
        return knex.raw(`SELECT * FROM user_team ut INNER JOIN teams t on ut.team_id = t.team_id WHERE ut.user_id = 1`)
    },
    insertTeam(knex, newTeam) {
        return knex
            .insert(newTeam)
            .into('teams')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    insertUserTeam(knex, newUserTeam) {
        return knex
            .insert(newUserTeam)
            .into('user_team')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteAllTeams(knex) {
        return knex.raw(`TRUNCATE TABLE teams RESTART IDENTITY CASCADE`)
    }
}

module.exports = teamsService