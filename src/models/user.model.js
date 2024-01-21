"use strict";
const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";
const Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    usr_id: {
      type: Number,
      require:true
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép giá trị null và giữ nguyên tính duy nhất
    },

    usr_slug: {type: String, require: true},
    usr_name: {
      type: String,
      default: '',
    },
    usr_password: {
      type: String,
      default:''
    },
    usr_salf: {type:String, default: ''},
    usr_email: {type: String, require: true}, 
    usr_phone: {type:String, default: ""},
    usr_sex: {type: String, default: ""},
    usr_avatar:{type:String, default:''},
    usr_date_of_birth: {type:Date, default: null},
    usr_role: [{type: String, ref:'Role', default: ['user']}],
    usr_status: {type:String, default:'pending', enum:['pending', 'active', 'block']},
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: String,
  },

  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
