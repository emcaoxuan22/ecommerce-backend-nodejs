"use strict";

const { Created, SuccessResponse } = require("./core/success.response");
const {
  createComment,
  getCommentsByParentId,
  deleteComments,
} = require("../services/comment.service");
class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "create new comment",
      metaData: await createComment(req.body),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: "delete comment",
      metaData: await deleteComments(req.body),
    }).send(res);
  };

  getCommentByParenId = async (req, res, next) => {
    new SuccessResponse({
      message: "get success comment",
      metaData: await getCommentsByParentId(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
