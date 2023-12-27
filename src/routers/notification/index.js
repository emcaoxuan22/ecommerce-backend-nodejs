const express = require("express");
const router = express.Router();
const { authentication } = require("../../auths/authUtils");
const { asyncHandle } = require("../../helpers/asyncHander");
const notificationController = require("../../controllers/notification.controller");





//authentication
router.use(authentication);

// authentication

router.get("", asyncHandle(notificationController.listNotiByUser));



module.exports = router;