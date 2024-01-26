"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  createRole,
  roleList,
  resourceList,
  createResource,
} = require("../services/rbac.service");

const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: "create role",
    metaData: await createRole(req.body),
  }).send(res);
};

const newResource = async (req, res, next) => {
  new SuccessResponse({
    message: "create resource",
    metaData: await createResource(req.body),
  }).send(res);
};

const listRoles = async (req, res, next) => {
  new SuccessResponse({
    message: "list roles",
    metaData: await roleList(req.body),
  }).send(res);
};

const listResources = async (req, res, next) => {
  new SuccessResponse({
    message: "list resource",
    metaData: await resourceList(req.body),
  }).send(res);
};

module.exports = { newRole, newResource, listResources, listRoles };
