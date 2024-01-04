const express = require("express");
const { apikey, permissions } = require("../auths/checkAuth");
const router = express.Router();

//check apikey
// router.use(apikey);
//check permission
// router.use(permissions("0000"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/user", require("./user"));
router.use("/v1/api/google", require("./google"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api", require("./access"));

module.exports = router;
