const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const { createTokenPair, verifyJWT } = require("../auths/authUtils");
const { ApiError } = require("../core/ApiError");
const userModel = require("../models/user.model");
const KeyTokenService = require("./keyToken.service");
const handelCallbackService = async ({ profile, accessToken }) => {
  const { email, sub, name, displayName } = profile._json;
  let foundUser = await userModel.findOne({ email });
  if (!foundUser) {
    console.log("chay vao dykhong");
    // create user
    console.log(foundUser);
    foundUser = await new userModel({
      email: email,
      isEmailVerified: true,
      displayName: displayName,
      userName: name.givenName,
      googleId: sub,
    });

    await foundUser.save();
  }
  const isEmailVerified = foundUser.isEmailVerified;
  if (!isEmailVerified) {
    throw new ApiError(
      StatusCodes.NOT_MODIFIED,
      "email not authenicate , pleadss verify Email"
    );
  }
  if (!foundUser.googleId) {
    foundUser.googleId = sub;
    await foundUser.save();
  }
  // create token
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
  console.log(privateKey);
  console.log(publicKey);
  return {
    metaData: {
      user: foundUser,
      token: tokens,
    },
  };
};

module.exports = {
  handelCallbackService,
};
