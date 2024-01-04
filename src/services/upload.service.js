'use strict'
const createHttpError = require("http-errors")
// 1. upload from url image
const cloudinary = require("../configs/cloudinary.config")
const { create } = require("../models/keytoken.model")

// upload from url image
const uploadImageFromUrl = async() => {
    try {
        const urlImage = 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg'
        const folderName = 'product/shopId'
        const newFileName = 'testdemo'
        const results = await cloudinary.uploader.upload(urlImage, {
            public_id:newFileName,
            folder:folderName
        })
        console.log(results)    
        return results
    } catch (error) {
        console.error(`error:: ${error}`)
    }
}
 //2. upload from image local
 const uploadImageFromLocal = async({
    path,
    folderName= 'product/8499',

 }) => {
    try {
        const results = await cloudinary.uploader.upload(path, {
            public_id:'thumb',
            folder:folderName
        })
        console.log(results)    
        return {
            image_url: results.secure_url,
            shopId: 8499,
            thumb_url: await cloudinary.url(results.public_id, {
                height:100,
                width:100,
                format:"jpg"
            })
        }
    } catch (error) {
        console.error(`error:: ${error}`)
    }
}

//3. upload from image local 

const uploadImageFromLocalFiles = async({
    files,
    folderName= 'product/8499',

 }) => {

    try {
        console.log(`file:: `, files, folderName)
        if(!files.length) throw createHttpError.NotFound(`not file`)
        const uploadedUrls = []
        for(let file of files) {
            const results = await cloudinary.uploader.upload(file.path, {
                folder:folderName
            })
            uploadedUrls.push({
                image_url: results.secure_url,
                shopId: 8499,
                thumb_url: await cloudinary.url(results.public_id, {
                    height:100,
                    width:100,
                    format:"jpg"
            })
            })
    }
        return uploadedUrls
    } catch (error) {
        console.error(`error:: ${error}`)
    }
}
module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles
}
