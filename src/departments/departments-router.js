const path = require('path');
const express = require('express')
const xss = require('xss')
const DepartmentsService = require('./departments-service')

const departmentRouter = express.Router()
const jsonParser = express.json()

const serialize = department => ({
    department_id: department.department_id,
    _id: xss(department._id),
    department_name: xss(department.department_name)
})

departmentRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        DepartmentsService.getAllDepartments(knexInstance)
            .then(departments => {
                res.json(departments.map(serialize))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { _id, department_name, department_type, description, department_time } = req.body;
        const newDepartment = { _id, department_name, department_type, description, department_time };

        for (const [key, value] of Object.entries(newDepartment)){
            if (!value) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        DepartmentsService.insertDepartment(
            req.app.get('db'),
            newDepartment
        )
            .then(department => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${department.department_id}`))
                    .json(serialize(department))
            })
            .catch(next)
    })

departmentRouter
    .route('/:department_id')
    .all((req, res, next) => {
        const departmentId = Number(req.params.department_id)
        DepartmentsService.getById(
            req.app.get('db'),
            departmentId
        )
            .then(department => {
                if (!department) {
                    return res.status(404).json({
                        error: { message: `Department does not exist` }
                    })
                }
                res.department = department;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json({
            department_id: res.department.department_id,
            _id: xss(res.department._id),
            department_name: xss(res.department.department_name),
            department_type: xss(res.department.department_type),
            description: xss(res.department.description),
            department_time: xss(res.department.department_time), //TODO: sanitize title with map serialize
        })
    })
/*.delete(jsonParser, (req, res, next) => {
    DepartmentsService.deleteDepartment(req.app.get('db'),
        req.params.department_id)
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
})
.patch(jsonParser, (req, res, next) => {
    const { department_name } = req.body;
    const departmentToUpdate = { department_name }


    if (!department_name) {
        return res.status(400).json({
            error: { message: `Request body must contain a department_name ` }
        })
    }

    DepartmentsService.updateDepartment(
        req.app.get('db'),
        req.params.department_id,
        departmentToUpdate
    )

        .then(numRowsAffected => {
            res.status(204).end()
        })

        .catch(next)
})*/

module.exports = departmentRouter