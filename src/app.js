const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//init middleares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// require('./tests/checkredis.test')
//test pub.sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product:003')
// init db
require("./dbs/init.mongodb");
// const {checkOverLoad} = require("./helpers/check.connect")
// checkOverLoad()

// init router
app.use("/", require("./routers"));
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
    stack: error.stack,
  });
});
module.exports = app;
