"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auths/authUtils");
const { BadRequestError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const createHttpError = require("http-errors");
const { ApiError } = require("../core/ApiError");
const { StatusCodes } = require("http-status-codes");
const rolesShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITER: "EDITER",
  ADMIN: "ADMIN",
};
class AccessService {
  static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId);
      throw createHttpError.Forbidden(
        "something is happen wrong!!, pleas relogin"
      );
    }
    if (keyStore.refreshToken !== refreshToken)
      throw createHttpError.Unauthorized("Shop not register");

    //check userId or email
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw createHttpError.NotFound("email is not register");
    //create 1 cap token moi
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );
    keyStore.refreshToken = tokens.refreshToken;
    keyStore.refreshTokenUsed.push(refreshToken);

    await keyStore.save();

    return {
      user,
      tokens,
    };
  };
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
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Error: shop already registered"
      );
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
