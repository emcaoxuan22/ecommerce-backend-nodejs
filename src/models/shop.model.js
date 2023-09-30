"use strict";
const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "shop";
const COLECTION_NAME = "shops";
const Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
var shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
