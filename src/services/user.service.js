"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair, verifyJWT } = require("../auths/authUtils");
const { StatusCodes } = require("http-status-codes");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');

const { ApiError } = require("../core/ApiError");
const userModel = require("../models/user.model");
const KeyTokenService = require("./keyToken.service");
const { verifyEmail, sendVerificationEmail } = require("../auths/verifyEmail");
const { convertToObjectIdMongodb } = require("../utils");
class UserService {
  static findByEmail = async ({
    usr_email,
    select = { usr_email: 1, usr_password: 1, usr_name: 1, usr_status: 1 },
  }) => {
    return await userModel.findOne({ usr_email }).select(select).lean();
  };

  static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {

    const { usr_id, usr_email, usr_roles } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(usr_id);
      throw createHttpError.Forbidden(
        "something is happen wrong!!, pleas relogin"
      );
    }
    if (keyStore.refreshToken !== refreshToken)
      throw createHttpError.Unauthorized("Shop not register");

    //check userId or email
    const foundShop = await this.findByEmail({ usr_email });
    if (!foundShop) throw createHttpError.NotFound("email is not register");
    //create 1 cap token moi
    const tokens = await createTokenPair(
      {
        usr_id,
        usr_email,
        usr_roles,
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
  static signup = async ({ usr_name, usr_password, usr_email }) => {
    const foundEmail = await userModel.findOne({
      usr_email,
      isEmailVerified: true,
    });
    if (foundEmail) throw new ApiError(StatusCodes.CONFLICT, "user is exists");
    const verificationCode = Math.random().toString(36).substring(2, 8);
    const passwordHash = await bcrypt.hash(usr_password, 10);
    const userObj = await userModel.create({
      usr_id: Math.floor(Math.random() * 1000000),
      usr_name,
      usr_email,
      usr_password: passwordHash,
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
        usr_id: userObj.usr_id,
        usr_email:userObj.usr_email,
        usr_roles: userObj.usr_role
      },
      publicKey,
      privateKey
    );
    const tokenKeyString = await KeyTokenService.createKeyToken({
      userId: userObj.usr_id,
      publicKey: publicKey,
      privateKey: privateKey,
      refreshToken: tokens.refreshToken,
    });
    await sendVerificationEmail(usr_email, verificationCode);
    return {
      metaData: {
        shop: userObj,
        token: tokens,
      },
    };
  };
  static login = async ({ email, password }) => {
    const foundUser = await userModel.findOne({ usr_email:email });
    if (!foundUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "user do not exists");
    //check password
    const match = await bcrypt.compare(password, foundUser.usr_password);
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
        usr_id: foundUser.usr_id,
        usr_email: foundUser.usr_email,
        usr_roles: foundUser.usr_role
      },
      publicKey,
      privateKey
    );
    const tokenKeyString = await KeyTokenService.createKeyToken({
      userId: foundUser.usr_id,
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
    const user = await userModel.findOne({
      usr_id:userId,
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
