'use strict'
const createHttpError = require('http-errors')
const Comment = require('../models/comment.model')
const {findProduct} = require('../models/repositories/product.repo')
/*
    key feature: comment service
    + add comment [User, Shop]
    + get a list of comment [User, Shop]
    + delete a comment [user, shop, admin]
*/
class CommentService {  
    static async createComment({
        productId, userId, content, parentCommentId=null
    }){
       const comment = new Comment({
        comment_productId:productId,
        comment_userId:userId,
        comment_content:content,
        comment_parent:parentCommentId
       }) 
       let rightValue
       if(parentCommentId) {
        // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment) throw createHttpError.NotFound("parent comment not found")
            rightValue = parentComment.comment_right
            // update many comments
            await Comment.updateMany({
                comment_productId: productId,
                comment_right: {$gte:rightValue}
            },{
                $inc: {comment_right:2}
            })
            await Comment.updateMany({
                comment_productId: productId,
                comment_left:{$gt:rightValue}
            },{
                $inc:{comment_left:2}
            })
       }else{
            const maxRightValue = await Comment.findOne({
                comment_productId: productId
            }, 'comment_right', {sort:{comment_right:-1}})
            if(maxRightValue){
                rightValue = maxRightValue.right + 1
            }else{
                rightValue = 1
            }
       }

       // insert to comment
       comment.comment_left = rightValue
       comment.comment_right = rightValue + 1
       await comment.save()
       return comment
    }
    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }){
        if(parentCommentId){
            const parent = await Comment.findById(parentCommentId)
            if(!parent) throw createHttpError.NotFound('Not found comment fo product')
            const comments = await Comment.find({
                comment_productId: productId,
                comment_left:{$gte:parent.comment_left},
                comment_right: {$lte: parent.comment_right}
            }).select({
                comment_left:1,
                comment_right:1,
                comment_content:1,
                comment_parentId:1
            }).sort({
                comment_left:1
            })
            return comments
        }
        const comments = await Comment.find({
            comment_productId: productId,
            comment_parent:null
        }).select({
            comment_left:1,
            comment_right:1,
            comment_content:1,
            comment_parentId:1
        }).sort({
            comment_left:1
        })
        return comments
    }
    // delete comments
    static async deleteComments({
        commentId, productId
    }){
        console.log(commentId, productId)
        // check the product exists in the database
        const foundProduct = await findProduct({
            product_id:productId
        })

        if(!foundProduct) throw createHttpError("product not found")
        // 1: xac dinh gia tri left vs right of comment
        const comment = await Comment.findById(commentId)
        if(!comment) throw createHttpError.NotFound('comment not found')
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        // 2: tinh width
        const width = rightValue - leftValue + 1 
        console.log(width)
        //3 : xoa tat ca commentId con 
        await Comment.deleteMany({
            comment_productId: productId,
            comment_left:{$gte:leftValue},
            comment_right:{$lte:rightValue}
        }) 
        // 4: cap nhat gia tri left va right con lai
        await Comment.updateMany({
            comment_productId: productId,
            comment_right:{$gt:rightValue}
        },{
            $inc:{comment_right:-width}
        })

        await Comment.updateMany({
            comment_productId: productId,
            comment_left:{$gt:rightValue}
        },{
            $inc:{comment_left:-width}
        })
        return true
    }
}

module.exports = CommentService