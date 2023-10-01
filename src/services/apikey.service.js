"use strict";
const createHttpError = require("http-errors");
const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findById = async (key) => {

  const objKey = apikeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
