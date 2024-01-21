"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");
const userService = require("../services/user.service");

class userController {
  handleRefeshToken = asyncHandle(async (req, res, next) => {

    res.status(200).json(
      await userService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      })
    );
  });
  signUp = asyncHandle(async (req, res, next) => {
    console.log(`[P]:: `, req.body);
    new Created({
      message: "Register OK",
      metaData: await userService.signup(req.body),
    }).send(res);
  });
  login = asyncHandle(async (req, res, next) => {
    console.log(`[P]:: `, req.body);
    new Created({
      message: "Login OK",
      metaData: await userService.login(req.body),
    }).send(res);
  });
  verifyEmail = asyncHandle(async (req, res) => {
    const result = await userService.verifyEmail(req.params);
    res.send("oke");
  });

  logout = asyncHandle(async (req, res, next) => {
    new SuccessResponse({
      message: "logout success",
      metaData: await userService.logout({ keyStore: req.keyStore }),
    }).send(res);
  });
}

module.exports = new userController();
