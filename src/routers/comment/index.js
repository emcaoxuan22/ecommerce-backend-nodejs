const express = require("express");
const router = express.Router();
const { authentication } = require("../../auths/authUtils");
const { asyncHandle } = require("../../helpers/asyncHander");
const commentController = require("../../controllers/comment.controller");


router.get("", asyncHandle(commentController.getCommentByParenId));


//authentication
router.use(authentication);

// authentication

router.post("", asyncHandle(commentController.createComment));
router.delete("", asyncHandle(commentController.deleteComment));


module.exports = router;
 