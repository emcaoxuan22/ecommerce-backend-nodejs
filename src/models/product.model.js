"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "product";
const COLECTION_NAME = "products";

const productSchema = new Schema(
  {
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: {
      type: String,
      require: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Users" },
    product_attributes: { type: Schema.Types.Mixed, require: true },
  },
  {
    collection: COLECTION_NAME,
    timestamps: true,
  }
);

// // define the product type=Clothing
const clothingSchema =new Schema({
  brand: { type: String, require: true },
  size: String,
  material: String,
},
{
  collection: "clothes",
  timestamps: true,
});
  

// // define the product type=eletronics
const electronicSchema =new Schema({
  manufacturer: { type: String, require: true },
  model: String,
  material: String,
},
{
  collection: "electronics",
  timestamps: true,
});
  

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model("electronic", electronicSchema),
  clothing: model("clothing", clothingSchema),
};
