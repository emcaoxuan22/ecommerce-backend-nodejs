'use strict'

const { randomInt } = require('crypto') 
const { newOtp } = require('./otp.service')
const sendEmailToken = async({email=null}) => {
    try {
        // 1. get token
        const token = await newOtp({email})
        // 2. get template
        // const template = await 

    } catch (error) {
        
    }
}

module.exports = {
    sendEmailToken
}