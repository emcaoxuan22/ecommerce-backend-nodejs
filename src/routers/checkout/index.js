"use strict";

const express = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();
const { asyncHandle } = require("../../helpers/asyncHander");

router.post("/review", asyncHandle(checkoutController.checkoutReview));
router.post("/order", asyncHandle(checkoutController.order));

module.exports = router;
