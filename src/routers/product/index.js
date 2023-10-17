const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auths/authUtils");
const { asyncHandle } = require("../../helpers/asyncHander");

router.get(
  "/search/:keySearch",
  asyncHandle(productController.getListSearchProduct)
);
router.get("", asyncHandle(productController.findAllProducts));
router.get("/:product_id", asyncHandle(productController.findProduct));
//authentication
router.use(authentication);

//logout
router.post("/create-product", productController.createProduct);
router.patch(
  "/update-product/:productId",
  asyncHandle(productController.updateProduct)
);
router.post(
  "/publish-product-by-shop/:product_id",
  asyncHandle(productController.publishProductByShop)
);

router.post(
  "/unpublish-product-by-shop/:product_id",
  asyncHandle(productController.unPublishProductByShop)
);

//query
router.get("/drafts/all", asyncHandle(productController.getAllDraftsForShop));
router.get("/publish/all", asyncHandle(productController.getAllPublishForShop));

module.exports = router;
