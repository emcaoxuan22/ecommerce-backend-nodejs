const express = require("express");
const router = express.Router();
const { authentication } = require("../../auths/authUtils");
const { asyncHandle } = require("../../helpers/asyncHander");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk } = require("../../configs/multer.config");




//authentication
// router.use(authentication);

// authentication

router.post("/product/", asyncHandle(uploadController.uploadFile));
router.post("/product/thumb", uploadDisk.single('file'),asyncHandle(uploadController.uploadFileThumb));
router.post("/product/multiple", uploadDisk.array('files',3),asyncHandle(uploadController.uploadImageFromLocalFiles));



module.exports = router;
 