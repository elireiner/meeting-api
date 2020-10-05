const MetricsService = {
    
    getAllMetrics(knex) {
        return knex.select('*').from('metrics')
    },

    insertMetric(knex, newMetric) {
        return knex
            .insert(newMetric)
            .into('metrics')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('metrics').select('*').where('_id', id).first()
    },

    deleteMetric(knex, _id) {
        return knex('metrics')
            .where({ _id })
            .delete()
    },

    deleteAllMetrics(knex) {
        return knex.raw(`TRUNCATE TABLE metrics RESTART IDENTITY CASCADE;`)
    },

   /* updateMetric(knex, id, newMetricFields) {
        return knex('metrics')
            .where({ id })
            .update(newMetricFields)
    },*/
}

module.exports = MetricsService