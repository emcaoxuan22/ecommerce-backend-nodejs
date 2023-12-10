'use strict'

const { Created, SuccessResponse } = require("../core/success.response");
const {
    createComment
} = require('../services/comment.service')
class CommentController{
    createComment = async(req, res,next) => {
        new SuccessResponse({
            message: 'create new comment',
            metaData: await createComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()