"use strict";

// const ProductService = require("../services/production.service")
const ProductService = require("../services/production.service.xxx");
const { Created, SuccessResponse } = require("./core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");

class ProductController {
  createProduct = asyncHandle(async (req, res, next) => {
    new SuccessResponse({
      massage: "Create new Product success!",
      metaData: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  });

  //update product
  updateProduct = asyncHandle(async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product success",
      metaData: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  });

  // query //
  /**
   * @desc get all draft for shop
   * @param {number} limit
   * @param {number} skip
   * @return {json}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      massage: "get list draft success!",
      metaData: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      massage: "get list publish success!",
      metaData: await ProductService.findAllpublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    console.log(req.params.product_id);
    new SuccessResponse({
      massage: "get list publish success!",
      metaData: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      massage: "get list publish success!",
      metaData: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      massage: "get list search product success!",
      metaData: await ProductService.getListSearchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      massage: "get all product success!",
      metaData: await ProductService.findAllProducts(req.params),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      massage: "get product success!",
      metaData: await ProductService.findProduct(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
