"use strict";

const express = require("express");
const profileController = require("../../controllers/profile.controller");
const { asyncHandle } = require("../../helpers/asyncHander");
const { grandAccess } = require("../../middlewares/rbac");
const { authentication } = require("../../auths/authUtils");
const router = express.Router();
router.use(authentication);
//admin
router.get(
  "/viewAny",
  grandAccess("readAny", "profile"),
  asyncHandle(profileController.profiles)
);

//shop
router.get(
  "/viewOwn",
  grandAccess("readOwn", "profile"),
  asyncHandle(profileController.profile)
);

module.exports = router;
