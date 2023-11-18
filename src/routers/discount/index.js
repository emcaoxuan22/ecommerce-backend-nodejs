const express = require("express");
const router = express.Router();
const { authentication } = require("../../auths/authUtils");
const { asyncHandle } = require("../../helpers/asyncHander");
const discountController = require("../../controllers/discount.controller");

//get amount a discount
router.post("/amount", asyncHandle(discountController.getDiscountAmount));
router.get(
  "/list-product-code",
  asyncHandle(discountController.getAllProductsCodesWithDiscount)
);
//authentication
router.use(authentication);

// authentication

router.post("", asyncHandle(discountController.createDiscountCode));
router.get("", asyncHandle(discountController.getAllDiscountCodes));

module.exports = router;
