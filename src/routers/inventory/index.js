"use strict";

const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const router = express.Router();
const { asyncHandle } = require("../../helpers/asyncHander");

const { authentication } = require("../../auths/authUtils");
router.use(authentication);
router.post("", asyncHandle(inventoryController.addStockToInventory));

module.exports = router;
