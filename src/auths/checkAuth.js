"use strict";
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const { findById } = require("../services/apikey.service");

const apikey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({ message: "Forbiden Error" });
    }
    //check objkey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbiden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    return res.send(error);
  }
};

const permissions = (permission) => (req, res, next) => {
  if (!req.objKey.permissions) {
    return res.status(403).json({
      message: "access deny",
    });
  }
  const validPermission = req.objKey.permissions.includes(permission);
  if (!validPermission) {
    return res.status(403).json({
      message: "access deny",
    });
  }

  next();
};

module.exports = {
  apikey,
  permissions,
};
