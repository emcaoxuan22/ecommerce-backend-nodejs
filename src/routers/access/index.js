const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auths/authUtils");

router.post("/shop/login", accessController.login);
router.post("/shop/signup", accessController.signUp);

//authentication
router.use(authentication);

//logout
router.post("/logout", accessController.logout);
module.exports = router;
