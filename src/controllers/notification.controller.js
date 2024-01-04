'use strict'

const { Created, SuccessResponse } = require("../core/success.response");
const {
    createComment,getCommentsByParentId, deleteComments
} = require('../services/comment.service');
const { listNotiByUser } = require("../services/notification.service");
class NotiController{
    listNotiByUser = async(req, res,next) => {
        new SuccessResponse({
            message: 'list notification',
            metaData: await listNotiByUser(req.query)
        }).send(res)
    }

}

module.exports = new NotiController()