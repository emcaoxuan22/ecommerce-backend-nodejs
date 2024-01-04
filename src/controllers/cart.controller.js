"use strict";
const { Created, SuccessResponse } = require("./core/success.response");
const CartService = require("../services/cart.service");
class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new  cart success",
      metaData: await CartService.addTocart({
        ...req.body,
      }),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart success",
      metaData: await CartService.addTocartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "deleted Cart success",
      metaData: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "list cart success",
      metaData: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
