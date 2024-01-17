const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const { authentication } = require("../../auths/authUtils");
const {
  signupValidation,
} = require("../../middlewares/access/signupValidations");
const { asyncHandle } = require("../../helpers/asyncHander");

router.get(
  "/verify-email/:userId/:verificationCode",
  userController.verifyEmail
);
router.post("/login", userController.login);
router.post("/signup", userController.signUp);
// Express route handler

//authentication
router.use(authentication);
router.post("/logout", userController.logout);
router.post("/handleRefreshToken", userController.handleRefeshToken);

module.exports = router;
