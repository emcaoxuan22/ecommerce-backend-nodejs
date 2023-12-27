'use strict'

const cloudinary = require('cloudinary').v2

// return 'https' urls by setting secure: true

cloudinary.config({
    cloud_name: 'dhutran5e',
    api_key: '463548817913527',
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// log the configuration
// console.log(cloudinary.config())
module.exports = cloudinary