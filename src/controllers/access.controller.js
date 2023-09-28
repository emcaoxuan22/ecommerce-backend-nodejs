"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");
const AccessService = require("../services/access.service");

class AccessController {
  login = asyncHandle(async (req, res, next) => {
    const { email, password } = req.body;
    res.status(200).json(await AccessService.login({ email, password }));
  });

  signUp = asyncHandle(async (req, res, next) => {
    console.log(`[P]:: `, req.body);
    new Created({
      message: "Register OK",
      metaData: await AccessService.signup(req.body),
    }).send(res);
  });

  logout = asyncHandle(async (req, res, next) => {
    new SuccessResponse({
      message: "logout success",
      metaData: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  });
}

module.exports = new AccessController();
