const express = require("express");
const { apikey, permissions } = require("../auths/checkAuth");
const router = express.Router();

//check apikey
router.use(apikey);
//check permission
router.use(permissions("0000"));
router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
