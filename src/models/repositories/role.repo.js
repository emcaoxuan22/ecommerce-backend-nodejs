"use strict";
const userModel = require("../user.model");

const getRoleNameByUserId = async ({ userId }) => {
  try {
    // check name or slug exists
    // new resource

    const usr_role = await userModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $lookup: {
          from: "Roles",
          localField: "usr_role",
          foreignField: "_id",
          as: "roleinfor",
        },
      },
    ]);
    const roleNames = usr_role[0].roleinfor.map((role) => role.rol_name);

    return roleNames;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getRoleNameByUserId,
};
