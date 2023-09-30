"use strict";
const createHttpError = require("http-errors");
const { product, clothing, electronic } = require("../models/product.model");

//define Fator classs to create product

class ProductFactory {
  static async createProduct(type, payload) {
    switch(type){
      case 'Electronics':
        return new Electronic(payload).createProduct()
      case 'Clothing':
        return new Clothing(payload).createProduct()
      default:
        throw createHttpError(`Invalid Product Types ${type}`)
  }
  }
}


// define base product class
class Product {
  constructor({
    product_name,product_thumb, product_description, product_price,
    product_quantity, product_type, product_shop, product_attributes
  }){
    this.product_name=product_name,
    this.product_thumb=product_thumb,
    this.product_description=product_description,
    this.product_price=product_price,
    this.product_quantity=product_quantity,
    this.product_type=product_type,
    this.product_shop=product_shop,
    this.product_attributes=product_attributes
  }

  //create new product
  async createProduct(){
    return await product.create(this)
  }
}

//define sub-class for different product types clothing
class Clothing extends Product{
  async createProduct(){
    const newClothing = await clothing.create(this.product_attributes)
    if(!newClothing) throw createHttpError.BadRequest('create clothing error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw createHttpError.BadRequest('create new Product error')
    return newProduct
  }
}

class Electronic extends Product{
  async createProduct(){
    const newElectronic = await electronic.create(this.product_attributes)
    if(!newElectronic) throw createHttpError.BadRequest('create electronic error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw createHttpError.BadRequest('create new Product error')
    return newProduct
  }
}

module.exports = ProductFactory