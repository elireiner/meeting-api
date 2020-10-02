const DepartmentsService = {
    
    getAllDepartments(knex) {
        return knex.select('*').from('departments')
    },

    insertDepartment(knex, newDepartment) {
        return knex
            .insert(newDepartment)
            .into('departments')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('departments').select('*').where('id', id).first()
    },

    /*deleteDepartment(knex, id) {
        return knex('departments')
            .where({ id })
            .delete()
    },

    updateDepartment(knex, id, newDepartmentFields) {
        return knex('departments')
            .where({ id })
            .update(newDepartmentFields)
    },*/
}

module.exports = DepartmentsService