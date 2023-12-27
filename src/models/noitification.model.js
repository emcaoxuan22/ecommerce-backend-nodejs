'use strict'
const {model, Schema} = require('mongoose')
const DOCUMENT_NAME = 'notification'
const COLLECTION_NAME = 'notifications'


const notificationSchema = new Schema({
    noti_type: {type:String, enum:['ORDER-001','ORDER-2','PROMOTION-001','SHOP-001'], require:true},
    noti_senderId:{type:String, require:true},
    noti_receivedId:{type:String, required:true},
    noti_content:{type:String, required:true},
    noti_options:{type:Object, default:{}}
},{
    timestamps: true,
    collection:COLLECTION_NAME
})

module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}