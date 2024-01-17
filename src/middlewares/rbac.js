'use strict'
const createHttpError = require('http-errors')
const { ApiError } = require('../core/ApiError')
const rbac = require('./role.middleware')
const grandAccess = (action, resource) => {
    return async(req, res, next) => {
        try {
            const role_name = req.query.role
            const permission = rbac.can(role_name)[action](resource)
            if(!permission.granted) {
                throw new ApiError(403, "fobidden")
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    grandAccess
}