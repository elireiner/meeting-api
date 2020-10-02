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
        return knex.from('metrics').select('*').where('metric_id', id).first()
    },

    /*deleteMetric(knex, id) {
        return knex('metrics')
            .where({ id })
            .delete()
    },

    updateMetric(knex, id, newMetricFields) {
        return knex('metrics')
            .where({ id })
            .update(newMetricFields)
    },*/
}

module.exports = MetricsService