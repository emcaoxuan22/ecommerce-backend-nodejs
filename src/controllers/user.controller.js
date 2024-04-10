"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");
const userService = require("../services/user.service");

class UserController {
  // new user
  newUser = async () => {

  }

  // check user token via email
  checkRegisterEmailToken = async () => {}
}

module.exports = new UserController();
