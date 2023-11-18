"use strict";
const CheckoutService = require("../services/checkout.service");
const { Created, SuccessResponse } = require("../core/success.response");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "create new cart success",
      metaData: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
