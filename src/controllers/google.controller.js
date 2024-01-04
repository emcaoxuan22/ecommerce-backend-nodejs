"use strict";

const { Created, SuccessResponse } = require("./core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");
const { handelCallbackService } = require("../services/google.service");
const userService = require("../services/user.service");

class googleController {
  HandelCallback = async (req, res) => {
    console.log("chayvao day,", req.user);
    const handelCallback = await handelCallbackService(req.user);
    // Successful authentication, redirect home.
    new SuccessResponse({
      massage: "Create new google account!",
      metaData: handelCallback,
    }).send(res);
  };
}

module.exports = new googleController();
