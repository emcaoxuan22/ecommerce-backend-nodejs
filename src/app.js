const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
// const file = fs.readFileSync(path.resolve("./ecommerce-swagger.yaml"), "utf8");
const options =  {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ecommerce ',
      version: '1.0.0',
    },
  },
  apis: [path.resolve(__dirname, './openapi/*.yaml')], // files containing annotations as above
};
const openapiSpecification = swaggerJsDoc(options);
// const swaggerDocument = YAML.parse(file);
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
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
  // origin: "https://longcv.onrender.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// init router

app.use("/", require("./routers"));
app.use((req, res, next) => {
  res.redirect('/api-docs');
});
app.use(cors(corsOptions));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(errorHandlingMiddleWare);
module.exports = app;
