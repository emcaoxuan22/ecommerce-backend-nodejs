"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auths/authUtils");
const { BadRequestError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const rolesShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITER: "EDITER",
  ADMIN: "ADMIN",
};
class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    //checkemail in dbs
    const shopObj = await findByEmail({ email });
    if (!shopObj) {
      throw new BadRequestError("email is not register");
    }
    //check match password
    const match = await bcrypt.compare(password, shopObj.password);
    if (!match) {
      throw new BadRequestError("password is not true");
    }
    //create AT and RT and save
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const tokens = await createTokenPair(
      {
        userId: shopObj._id,
        email,
      },
      publicKey,
      privateKey
    );
    const tokenKeyString = await KeyTokenService.createKeyToken({
      userId: shopObj._id,
      publicKey: publicKey,
      privateKey: privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      metaData: {
        shop: shopObj,
        token: tokens,
      },
    };
  };
  static signup = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: shop already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [rolesShop.SHOP],
    });
    if (newShop) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );

      const tokenKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey: publicKey,
        privateKey: privateKey,
        refreshToken: tokens.refreshToken,
      });
      return {
        code: 201,
        metaData: {
          shop: newShop,
          token: tokens,
        },
      };
    }
    return {
      code: 200,
      metaData: null,
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };
}

module.exports = AccessService;
