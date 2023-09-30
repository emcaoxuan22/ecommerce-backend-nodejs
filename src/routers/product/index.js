const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auths/authUtils");


//authentication
router.use(authentication);

//logout
router.post("/create-product", productController.createProduct);

module.exports = router;