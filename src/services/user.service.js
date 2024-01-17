"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair, verifyJWT } = require("../auths/authUtils");
const { StatusCodes } = require("http-status-codes");
const nodemailer = require("nodemailer");

const { ApiError } = require("../core/ApiError");
const userModel = require("../models/user.model");
const KeyTokenService = require("./keyToken.service");
const { verifyEmail, sendVerificationEmail } = require("../auths/verifyEmail");
const { convertToObjectIdMongodb } = require("../utils");

class UserService {
  static findByEmail = async ({
    email,
    select = { email: 1, password: 1, name: 1, status: 1 },
  }) => {
    return await userModel.findOne({ email }).select(select).lean();
  };

  static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email, roles } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId);
      throw createHttpError.Forbidden(
        "something is happen wrong!!, pleas relogin"
      );
    }
    if (keyStore.refreshToken !== refreshToken)
      throw createHttpError.Unauthorized("Shop not register");

    //check userId or email
    const foundShop = await this.findByEmail({ email });
    if (!foundShop) throw createHttpError.NotFound("email is not register");
    //create 1 cap token moi
    const tokens = await createTokenPair(
      {
        userId,
        email,
        roles,
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
  static sinup = async ({ username, password, email }) => {
    const foundEmaill = await userModel.findOne({
      email,
      isEmailVerified: true,
    });
    if (foundEmaill) throw new ApiError(StatusCodes.CONFLICT, "user is exists");
    const verificationCode = Math.random().toString(36).substring(2, 8);
    const passwordHash = await bcrypt.hash(password, 10);
    const userObj = await userModel.create({
      userName: username,
      email,
      password: passwordHash,
      emailVerificationCode: verificationCode,
    });
    // create AT and RT for user
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
        userId: userObj._id,
        email,
      },
      publicKey,
      privateKey
    );
    const tokenKeyString = await KeyTokenService.createKeyToken({
      userId: userObj._id,
      publicKey: publicKey,
      privateKey: privateKey,
      refreshToken: tokens.refreshToken,
    });
    await sendVerificationEmail(email, verificationCode);
    return {
      metaData: {
        shop: userObj,
        token: tokens,
      },
    };
  };
  static login = async ({ email, password }) => {
    const foundUser = await userModel.findOne({ email });
    if (!foundUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "user do not exists");
    console.log(foundUser);
    //check password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new ApiError(StatusCodes.FORBIDDEN, "password is wrong");
    // create AT and RT
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
        userId: foundUser._id,
        email,
      },
      publicKey,
      privateKey
    );
    const tokenKeyString = await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
      privateKey: privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      metaData: {
        user: foundUser,
        token: tokens,
      },
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };
  static verifyEmail = async ({ userId, verificationCode }) => {
    // Kiểm tra xem userId và verificationCode có hợp lệ hay không
    const user = await userModel.findById({
      _id: convertToObjectIdMongodb(userId),
    });
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "user not exists");
    if (user.emailVerificationCode === verificationCode) {
      // Xác minh email thành công, cập nhật trạng thái và xóa mã xác minh
      user.isEmailVerified = true;
      user.emailVerificationCode = undefined;
      await user.save();

      // Chuyển hướng hoặc hiển thị thông báo xác minh thành công
      return {
        status: "update success",
      };
    } else {
      // Xác minh email không thành công, chuyển hướng hoặc hiển thị thông báo lỗi
      res.send("authenticate email fail");
    }
  };
}
module.exports = UserService;
