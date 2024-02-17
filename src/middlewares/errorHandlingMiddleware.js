const mylogger = require("../loggers/mylogger.log");
const errorHandlingMiddleWare = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  mylogger.error(error.message, [req.url, 'vvv333444',error.statusCode])
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
    stack: error.stack,
  });
};

module.exports = {
  errorHandlingMiddleWare,
};
