"use strict";

// const ProductService = require("../services/production.service")
const ProductService = require("../services/production.service.xxx");
const { Created, SuccessResponse } = require("./core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "successfull Code Generations",
      metaData: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Successfull Code Found",
      metaData: await DiscountService.getAllDiscountCodesByShop({
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    console.log(req.body);
    new SuccessResponse({
      message: "Successfull Code Found",
      metaData: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  };

  getAllProductsCodesWithDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Successfull Code Found",
      metaData: await DiscountService.getAllProductsCodesWithDiscount(
        req.query
      ),
    }).send(res);
  };
}

module.exports = new DiscountController();
