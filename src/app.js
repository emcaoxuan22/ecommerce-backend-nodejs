const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const file = fs.readFileSync(path.resolve("ecommerce-swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);
const {
  errorHandlingMiddleWare,
} = require("./middlewares/errorHandlingMiddleware");
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// require('./tests/checkredis.test')
//test pub.sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product:003')
// init db
require("./dbs/init.mongodb");
// const {checkOverLoad} = require("./helpers/check.connect")
// checkOverLoad()

// cấu hình cors
app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// init router
app.use((req, res, next) => {
  res.redirect('/api-docs');
});
app.use("/", require("./routers"));

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(errorHandlingMiddleWare);
module.exports = app;
