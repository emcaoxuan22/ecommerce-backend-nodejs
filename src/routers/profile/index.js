"use strict";

const express = require("express");
const profileController = require("../../controllers/profile.controller");
const { asyncHandle } = require("../../helpers/asyncHander");
const { grandAccess } = require("../../middlewares/rbac");
const router = express.Router();

//admin
router.get("/viewAny", grandAccess('readAny', 'profile'),asyncHandle(profileController.profiles));

//shop
router.get("/viewOwn", grandAccess('readOwn', 'profile'),asyncHandle(profileController.profile));

module.exports = router;
