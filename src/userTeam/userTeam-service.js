const userTeamService = {
    
    getAllTeams(knex) {
        return knex.select('*').from('teams')
    },
// TODO: dynamically use the ud
    getById(knex, id) {
        return knex.raw(`SELECT * FROM user_team ut INNER JOIN teams t on ut.team_id = t.team_id WHERE ut.user_id = 1`)
    },
}

module.exports = userTeamService