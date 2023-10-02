const JWT = require("jsonwebtoken");
const { asyncHandle } = require("../helpers/asyncHander");
const createHttpError = require("http-errors");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "client-id",
  REFRESHTOKEN: "refreshtoken",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
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
  if(req.headers[HEADER.REFRESHTOKEN]){
    const refreshtoken = req.headers[HEADER.REFRESHTOKEN]
    const decodeUser = JWT.verify(refreshtoken, keyStore.publicKey)
    if(userId !== decodeUser.userId) throw createHttpError.Unauthorized('Invalid user')
    req.keyStore = keyStore
    req.refreshToken = refreshtoken
    req.user = decodeUser
    return next()
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw createHttpError.BadRequest("invalid request");
  }
  const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
  if (userId !== decodeUser.userId) {
    throw createHttpError.BadRequest("invalid user");
  }
  req.keyStore = keyStore;
  req.user = decodeUser
  return next();
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
