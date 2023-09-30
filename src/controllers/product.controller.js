'use strict'

const ProductService = require("../services/production.service")
const { Created, SuccessResponse } = require("../core/success.response");
const { asyncHandle } = require("../helpers/asyncHander");


class ProductController {
    createProduct = asyncHandle(async(req, res, next) => {
        new SuccessResponse({
            massage: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, req.body)
        }).send(res)
    })
}

module.exports = new ProductController