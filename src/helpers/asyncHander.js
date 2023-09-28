"use strict";

const asyncHandle = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.log("vao catch");
      next(error);
    });
  };
};

module.exports = {
  asyncHandle,
};
