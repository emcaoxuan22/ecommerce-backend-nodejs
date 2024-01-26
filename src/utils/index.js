"use strict";
const { Schema, Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => {
  console.log(id);
  return new Types.ObjectId(id);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
    if (typeof obj[k] === "object") {
      removeUndefineObject(obj[k]);
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

const extractBearerToken = (authorizationHeader) => {
  // Kiểm tra xem chuỗi "Authorization" có tồn tại hay không
  if (!authorizationHeader) {
    return null;
  }

  // Tách chuỗi "Bearer" và lấy phần token
  const parts = authorizationHeader.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }

  // Trả về null nếu định dạng không đúng
  return null;
};
module.exports = {
  getSelectData,
  getUnSelectData,
  removeUndefineObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
  extractBearerToken,
};
