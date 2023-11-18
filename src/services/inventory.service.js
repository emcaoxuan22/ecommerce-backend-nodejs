"use strict";

const { createHash } = require("crypto");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");
const createHttpError = require("http-errors");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "123, Tran phu, Hcm city",
  }) {
    const product = await getProductById(productId);

    if (!product)
      throw createHttpError.BadRequest("the product does not exists");
    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
