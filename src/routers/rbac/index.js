"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandle } = require("../../helpers/asyncHander");
const {
  newRole,
  listRoles,
  newResource,
  listResources,
} = require("../../controllers/rbac.controller");

router.post("/role", asyncHandle(newRole));
router.get("/roles", asyncHandle(listRoles));
router.post("/resource", asyncHandle(newResource));
router.get("/resources", asyncHandle(listResources));
module.exports = router;
