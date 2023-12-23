const express = require("express");
const router = express.Router();
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleController = require("../../controllers/google.controller");
const { asyncHandle } = require("../../helpers/asyncHander");
router.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "782551066771-7srtitdqvoib7b8tv8s9rd76qai1tbbk.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/v1/api/google/auth/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, { profile, accessToken });
    }
  )
);

router.get(
  "/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/callback",
  passport.authenticate("google", {
    session: false,
  }),
  asyncHandle(googleController.HandelCallback)
);

module.exports = router;
