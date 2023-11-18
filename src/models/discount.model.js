"use strict";
const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: String, require: true },
    discount_descreption: { type: String, require: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, require: true },
    discount_code: { type: String, require: true },
    discount_start: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_mac_uses: { type: Number, require: true },
    discount_uses_count: { type: Number, require: true },
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_user: { type: Number, require: true },
    discount_min_order_value: { type: Number, require: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = { discount: model(DOCUMENT_NAME, discountSchema) };
