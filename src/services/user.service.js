"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair, verifyJWT } = require("../auths/authUtils");
const { StatusCodes } = require("http-status-codes");
const nodemailer = require("nodemailer");

const { ApiError } = require("../core/ApiError");
const userModel = require("../models/user.model");
const roleModel = require("../models/role.model");
const KeyTokenService = require("./keyToken.service");
const { verifyEmail, sendVerificationEmail } = require("../auths/verifyEmail");
const { convertToObjectIdMongodb } = require("../utils");
const { getRoleNameByUserId } = require("../models/repositories/role.repo");

class UserService {
  static findByEmail = async ({
    usr_email,
    select = { usr_email: 1, usr_password: 1, usr_name: 1, usr_status: 1 },
  }) => {
    return await userModel.findOne({ usr_email }).select(select).lean();
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
    const foundShop = await this.findByEmail({ usr_email: email });
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
  static sinup = async ({ usr_name, usr_password, usr_email }) => {
    const foundEmaill = await userModel.findOne({
      usr_email,
      isEmailVerified: true,
    });
    if (foundEmaill) throw new ApiError(StatusCodes.CONFLICT, "user is exists");
    const verificationCode = Math.random().toString(36).substring(2, 8);
    const passwordHash = await bcrypt.hash(usr_password, 10);
    const userObj = await userModel.create({
      usr_name,
      usr_email,
      usr_password: passwordHash,
      emailVerificationCode: verificationCode,
    });
    const user_role = await roleModel.findOne({ rol_name: "user" });
    userObj.usr_role.push(user_role._id);
    await userObj.save();
    const roleNames = await getRoleNameByUserId({ userId: userObj._id });
    console.log(roleNames);
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
        email: usr_email,
        roles: roleNames,
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
    await sendVerificationEmail(usr_email, verificationCode);
    return {
      metaData: {
        user: userObj,
        token: tokens,
      },
    };
  };
  static login = async ({ usr_email, usr_password }) => {
    const foundUser = await userModel.findOne({ usr_email });
    if (!foundUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "user do not exists");
    console.log(foundUser);
    //check password
    const match = await bcrypt.compare(usr_password, foundUser.usr_password);
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
    const roleNames = await getRoleNameByUserId({ userId: foundUser._id });
    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        email: foundUser.usr_email,
        roles: roleNames,
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
