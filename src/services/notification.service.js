'use strict'
const {NOTI} = require('../models/noitification.model')
const pushNotiToSystem = async({
    type='SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
    
}) => {
    let noti_content
    if(type === 'SHOP-001') {
        noti_content = '@@@ vua moi them mot san pham : @@@'
    }else if(type === 'PROMOTION-001'){
        noti_content = '@@@ vua moi them mot voucher: @@@'
    }
    const newNoti = await NOTI.create({
        noti_type:type,
        noti_content,
        noti_senderId:senderId,
        noti_recervedId:receivedId,
        noti_options:options
    })

    return newNoti
}

module.exports = {
    pushNotiToSystem
}