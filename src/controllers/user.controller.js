"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");
const userService = require("../services/user.service");

class userController {
  signUp = asyncHandle(async (req, res, next) => {
    console.log(`[P]:: `, req.body);
    new Created({
      message: "Register OK",
      metaData: await userService.sinup(req.body),
    }).send(res);
  });
  login = asyncHandle(async (req, res, next) => {
    console.log(`[P]:: `, req.body);
    console.log("vao login");
    new Created({
      message: "Login OK",
      metaData: await userService.login(req.body),
    }).send(res);
  });
  verifyEmail = asyncHandle(async (req, res) => {
    const result = await userService.verifyEmail(req.params);
    res.send("okeee");
  });
}

module.exports = new userController();
