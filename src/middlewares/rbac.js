"use strict";
const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { ApiError } = require("../core/ApiError");
const rbac = require("./role.middleware");
const { roleList } = require("../services/rbac.service");
const grandAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const role_name = req.user.roles;
      rbac.setGrants(await roleList());
      const permission = rbac.can(role_name)[action](resource);
      if (!permission.granted) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "user not permission");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
module.exports = {
  grandAccess,
};
