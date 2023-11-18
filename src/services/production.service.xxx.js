"use strict";
const createHttpError = require("http-errors");
const { product, clothing, electronic } = require("../models/product.model");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefineObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");

//define Fator classs to create product

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw createHttpError.BadRequest(`Invalid Product Types ${type}`);
    return new productClass(payload).createProduct();
  }

  //update product
  static async updateProduct(type, ProductId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw createHttpError.BadRequest(`Invalid Product Types ${type}`);
    return new productClass(payload).updateProduct(ProductId);
  }
  //PUT//
  static async publishProductByShop({ product_shop, product_id }) {
    const shop = await publishProductByShop({ product_shop, product_id });
    return shop;
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    const shop = await unPublishProductByShop({ product_shop, product_id });
    return shop;
  }
  //end put//
  //query//
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllpublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unselect: ["__v"] });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }

  //create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }
  //update Product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}

//define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    console.log("vo day");
    console.log(this);
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw createHttpError.BadRequest("create clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw createHttpError.BadRequest("create new Product error");
    return newProduct;
  }

  async updateProduct(productId) {
    //1. remove attr has null undefine
    const objectParams = removeUndefineObject(this);

    // 2. check xem up date o cho nao?
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw createHttpError.BadRequest("create electronic error");
    const newProduct = await super.createProduct();
    if (!newProduct)
      throw createHttpError.BadRequest("create new Product error");
    return newProduct;
  }
}
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
