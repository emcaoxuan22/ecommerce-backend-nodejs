const JWT = require("jsonwebtoken");
const { asyncHandle } = require("../helpers/asyncHander");
const createHttpError = require("http-errors");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "client-id",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    console.log(accessToken);
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    await JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("Error verify: ", err);
      } else {
        console.log("decode verify: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Co loi", error);
  }
};

const authentication = asyncHandle(async (req, res, next) => {
  /*
    1-check userId missing
    2-get accessToken
    3-verifyToken
    4-Check user in dbs
    5-check keyStore with this userid
    6-oke all -> return next()
  */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new createHttpError.BadRequest("Invalid request, user not exet");
  }
  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw createHttpError[404]("not found keyStore");
  }
  // check token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw createHttpError.BadRequest("invalid request");
  }
  const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
  console.log(decodeUser);
  if (userId !== decodeUser.userId) {
    throw createHttpError.BadRequest("invalid user");
  }
  req.keyStore = keyStore;
  return next();
});

module.exports = {
  createTokenPair,
  authentication,
};
