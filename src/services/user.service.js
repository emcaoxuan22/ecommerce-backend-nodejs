"use strict";
const { token } = require("morgan");
const { ApiError } = require("../core/ApiError");
const { SuccessResponse } = require("../core/success.response");
const USER = require("../models/user.model");
const newUser = async (email = null, captcha = null) => {
  //1 check email exits in dbs
  const user = await USER.findOne({ email }).lean();
  // 2. if email exits
  if(user) {
    return new ApiError(400, "Email is exits in dbs");
  }

  //3. send token via email user


  return new SuccessResponse({
    message: 'verify email success, please check your email to verify token',
    metaData: {
      token
    }
  })
}
module.exports = {
  newUser,
};
