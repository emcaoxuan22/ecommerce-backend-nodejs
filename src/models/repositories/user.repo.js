"use strict";

const { StatusCodes } = require("http-status-codes");
const { ApiError } = require("../../core/ApiError");
const { userRoleModel } = require("../user.model");

const getRoleByUserId = async (user_id) => {
  const user_role = await userRoleModel.find({ user_id: user_id });
  if (!user_role) throw new ApiError(StatusCodes.NOT_FOUND, "not exists role");
  console.log(user_role);

  return user_role;
};

module.exports = {
  getRoleByUserId,
};
