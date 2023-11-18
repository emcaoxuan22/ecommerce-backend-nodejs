"use strict";

const express = require("express");
const CartController = require("../../controllers/cart.controller");
const router = express.Router();
const { asyncHandle } = require("../../helpers/asyncHander");
const cartController = require("../../controllers/cart.controller");

router.post("", asyncHandle(cartController.addToCart));
router.delete("", asyncHandle(cartController.delete));
router.post("/update", asyncHandle(cartController.update));
router.get("", asyncHandle(cartController.listToCart));
module.exports = router;
