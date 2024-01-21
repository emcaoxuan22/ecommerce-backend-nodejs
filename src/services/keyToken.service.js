"use strict";
const { token } = require("morgan");
const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    console.log('userId', userId)
    try {
      //lv 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey,
      // });
      // return tokens ? tokens.publicKey : null;
      //lv xxx
      const filter = { userId: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        option = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({userId})
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };

  static findByRefeshTokenUsed = async (refreshTokenUsed) => {
    return await keyTokenModel.findOne({ refreshTokenUsed });
  };

  static findByRefeshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
