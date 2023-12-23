"use strict";
const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "user";
const COLECTION_NAME = "users";
const Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép giá trị null và giữ nguyên tính duy nhất
    },

    displayName: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    // Các trường khác của người dùng
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: String,
  },

  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
